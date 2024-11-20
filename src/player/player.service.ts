import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Player } from './entities/player.entity';
import { Connection, Model } from 'mongoose';
import { Team } from 'src/team/entities/team.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
  ){}
  async create(createPlayerDto: CreatePlayerDto) {
    // TODO: session can't be used because it is not replica set
    const session = await this.connection.startSession();
    session.startTransaction();
    try{
      const newPlayer = new this.playerModel({ 
        firstName: createPlayerDto.firstName,
        lastName: createPlayerDto.lastName,
        dateOfBirth: createPlayerDto.dateOfBirth,
        joinedTeam: createPlayerDto.joinedTeam,
        nationality: createPlayerDto.nationality,
        position: createPlayerDto.position,
        team: createPlayerDto.team
      });

      if(createPlayerDto.team){
        await this.teamModel.findByIdAndUpdate(createPlayerDto.team, 
          { $push: { players: newPlayer._id} },
          // { session }
        )
      }
      await newPlayer.save(
        // { session }
      );
      // Commit the transaction
      await session.commitTransaction();
      return newPlayer;
    }catch(error){
      // Abort the transaction on error
      await session.abortTransaction();
      throw error
    }finally{
      // End the session
      await session.endSession();
    }
  }

  findAll() {
    return this.playerModel.find().select(['-__v']).exec();
  }

  findById(id: string) {
    return this.playerModel.findOne({_id: id})
    .select(['-__v'])
    .populate({ path: 'team', strictPopulate: false }) // Populate players    
    .exec();
  }

  findByIdForDelete(id: string){
    return this.playerModel.findOne({_id: id}).exec();
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  async remove(id: string) {
    const existing = await this.findByIdForDelete(id);
    if(!existing){
      throw { name: "NotFoundError" }
    }
    // remove the player from team
    await this.teamModel.findByIdAndUpdate(
      existing.team,
      { $pull: { players: id} }
    )
    return this.playerModel.deleteOne({_id: id}).exec();
  }
}
