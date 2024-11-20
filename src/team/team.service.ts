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

    const session = await this.connection.startSession();
    session.startTransaction();
    try{
      const newTeam = new this.teamModel({ 
        name: createTeamDto.name,
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
        await this.playerModel.bulkWrite(bulkOperations);
      }
      if(createTeamDto.coach){
        await this.coachModel.findByIdAndUpdate(createTeamDto.coach, 
          { team: newTeam._id, joinedTeam: Date.now()}
        )
      }
      return newTeam.save();
    }catch(error){
      throw error;
    }finally {
      session.endSession();
    }
  }

  findAll() {
    return this.teamModel.find().select(['-__v']).exec();
  }
  findByName(name: string){
    return this.teamModel.findOne({name}).select(['-__v']).exec();
  }
  findById(id: string) {
    return this.teamModel.findOne({_id: id}).select(['-__v']).exec();
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  async remove(id: string) {
    const exiting = await this.findById(id);
    if(!exiting){
      throw { name: "NotFoundError" }
    }
    return this.teamModel.deleteOne({_id: id}).exec();
  }
}
