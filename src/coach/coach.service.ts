import { Injectable } from '@nestjs/common';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from 'src/team/entities/team.entity';
import { Coach } from './entities/coach.entity';

@Injectable()
export class CoachService {
  constructor(
    @InjectModel(Coach.name) private coachModel: Model<Coach>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
  ){}

  async create(createCoachDto: CreateCoachDto) {
    try{
      const newCoach = new this.coachModel({ 
        firstName: createCoachDto.firstName,
        lastName: createCoachDto.lastName,
        dateOfBirth: createCoachDto.dateOfBirth,
        joinedTeam: createCoachDto.joinedTeam,
        nationality: createCoachDto.nationality,
        team: createCoachDto.team
      });

      if(createCoachDto.team){
        const team = await this.teamModel.findById(createCoachDto.team);
        if(team.coach){
          throw { name: "DuplicatedCoachError" }
        }
        await this.teamModel.findByIdAndUpdate(createCoachDto.team, 
          { coach: newCoach._id },
        )
      }
      await newCoach.save();
      return newCoach;
    }catch(error){
      throw error
    }
  }

  findAll() {
    return this.coachModel.find().select(['-__v']).exec();
  }

  findById(id: string) {
    return this.coachModel.findOne({_id: id})
    .select(['-__v'])
    .populate({ path: 'team', strictPopulate: false }) // Populate players    
    .exec();
  }

  findByIdForDelete(id: string) {
    return this.coachModel.findOne({_id: id}).exec();
  }

  update(id: number, updateCoachDto: UpdateCoachDto) {
    return `This action updates a #${id} coach`;
  }

  async remove(id: string) {
    const existing = await this.findByIdForDelete(id);
    if(!existing){
      throw { name: "NotFoundError" }
    }
    // remove the player from team
    await this.teamModel.findByIdAndUpdate(
      existing.team,
      { coach: null }
    )
    return this.coachModel.deleteOne({_id: id}).exec();
  }
}
