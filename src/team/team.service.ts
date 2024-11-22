import { Injectable } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { Team } from './entities/team.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Player } from '../player/entities/player.entity';
import { Coach } from '../coach/entities/coach.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(Coach.name) private coachModel: Model<Coach>
  ){}

  async create(createTeamDto: CreateTeamDto) {
    const exiting = await this.findByName(createTeamDto.name);
    if(exiting){
      throw { name: "DuplicatedError" }
    }
    // TODO: session can't be used because it is not replica set
    const session = await this.connection.startSession();
    session.startTransaction();
    try{
      const newTeam = new this.teamModel({ 
        name: createTeamDto.name,
        tla: createTeamDto.tla,
        crest: createTeamDto.crest,
        teamColor: createTeamDto.teamColor,
        baseCity: createTeamDto.baseCity,
        establish: createTeamDto.establish,
        homeStadium: createTeamDto.homeStadium,
        players: createTeamDto.players || [],
        coach: createTeamDto.coach || null
      });
      // If there are players/coach, then need to update the their team property
      if(createTeamDto.players && createTeamDto.players.length > 0){
        const bulkOperations = createTeamDto.players.map(playerId => ({
          updateOne: {
            filter: { _id: playerId }, // Match by player ID
            update: {
              team: newTeam._id, // Assign the new team ID to the player
              joinedTeam: Date.now(), // Update the joinedTeam field
            },
          },
        }));
        // Execute bulk operations
        await this.playerModel.bulkWrite(bulkOperations, 
          // { session }
        );
      }
      if(createTeamDto.coach){
        await this.coachModel.findByIdAndUpdate(createTeamDto.coach, 
          { team: newTeam._id, joinedTeam: Date.now()},
          // { session }
        )
      }
      await newTeam.save(
        // { session }
      );
      // Commit the transaction
      await session.commitTransaction();
      return newTeam;
    }catch(error){
      // Abort the transaction on error
      await session.abortTransaction();
      throw error;
    }finally {
      session.endSession();
    }
  }

  findAll() {
    return this.teamModel.find().select(['-__v']).exec();
  }
  findByName(name: string){
    return this.teamModel.findOne({name})
    .select(['-__v'])
    .populate('players') // Populate players
    .populate({ path: 'coach', strictPopulate: false }) // Populate coach
    .exec();
  }
  findById(id: string) {
    return this.teamModel.findOne({_id: id})
    .select(['-__v'])
    .populate('players') // Populate players
    .populate({ path: 'coach', strictPopulate: false }) // Populate coach
    .exec();
  }
  findByIdWithoutPopulate(id: string){
    return this.teamModel.findOne({_id: id}).exec();
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const existing = await this.findByIdWithoutPopulate(id);
    if(!existing){
      throw { name: "NotFoundError" }
    }
    if(updateTeamDto.players && updateTeamDto.players.length > 0){
      // iterating over all existing players and set team null
      if(existing.players && existing.players.length > 0){
        const bulkOperations = existing.players.map(playerId => ({
          updateOne: {
            filter: { _id: playerId }, // Match by player ID
            update: {
              team: null,
              joinedTeam: null,
            },
          },
        }));
        // Execute bulk operations
        await this.playerModel.bulkWrite(bulkOperations);
      }
      // iterating over all new players and set team id
      const bulkOperations = updateTeamDto.players.map(playerId => ({
        updateOne: {
          filter: { _id: playerId }, // Match by player ID
          update: {
            team: id,
            joinedTeam: Date.now(),
          },
        },
      }));
      // Execute bulk operations
      await this.playerModel.bulkWrite(bulkOperations);
    }
    if(updateTeamDto.coach){
      // access existing coach and set team null
      if(existing.coach){
        await this.coachModel.findByIdAndUpdate(existing.coach, 
          {team: null}
        )
      }
      // iterating over all new players and set team id
      await this.coachModel.findByIdAndUpdate(updateTeamDto.coach, 
        {team: id}
      )
    }

    return await this.teamModel.findByIdAndUpdate(id, {
      name: updateTeamDto.name || existing.name, 
      tla: updateTeamDto.tla || existing.tla,
      crest: updateTeamDto.crest || existing.crest,
      teamColor: updateTeamDto.teamColor || existing.teamColor,
      baseCity: updateTeamDto.baseCity || existing.baseCity,
      establish: updateTeamDto.establish || existing.establish,
      homeStadium: updateTeamDto.homeStadium || existing.homeStadium,
      players: updateTeamDto.players || existing.players,
      maxNumber: updateTeamDto.maxNumber || existing.maxNumber,
      coach: updateTeamDto.coach || existing.coach,
    })
  }

  async remove(id: string) {
    const existing = await this.findById(id);
    if(!existing){
      throw { name: "NotFoundError" }
    }
    // remove team from all players and coach
    if(existing.players && existing.players.length > 0){
      const bulkOperations = existing.players.map(playerId => ({
        updateOne: {
          filter: { _id: playerId }, // Match by player ID
          update: {
            team: null,
            joinedTeam: null
          },
        },
      }));
      // Execute bulk operations
      await this.playerModel.bulkWrite(bulkOperations);
    }
    if(existing.coach){
      await this.coachModel.findByIdAndUpdate(
        existing.coach,
        { team: null }
      )
    }
    return this.teamModel.deleteOne({_id: id}).exec();
  }
}
