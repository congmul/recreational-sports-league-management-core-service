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
        profileUrl: createCoachDto.profileUrl,
        dateOfBirth: createCoachDto.dateOfBirth,
        joinedTeam: createCoachDto.joinedTeam,
        nationality: createCoachDto.nationality,
        team: createCoachDto.team,
        teamName: createCoachDto.teamName,
        crest: createCoachDto.crest
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

  findByIdWithoutPopulate(id: string) {
    return this.coachModel.findOne({_id: id}).exec();
  }

  async update(id: string, updateCoachDto: UpdateCoachDto) {
    const existing = await this.findByIdWithoutPopulate(id);
    if(!existing){
      throw { name: "NotFoundError" }
    }
    if(updateCoachDto.team){
      // TODO: Need to handle if coach already exist.
      const team = await this.teamModel.findById(updateCoachDto.team);
      // // Check if a coach is already assigned
      // if (team.coach) {
      //   throw { name: "DuplicatedCoachError" }
      // }

      // Remove the team from Previous Coach 
      await this.coachModel.findByIdAndUpdate(
        team.coach,
        { team: null, teamName: null, crest: null }
      )
      // Remove previous coach from original team
      await this.teamModel.findByIdAndUpdate(
        existing.team,
        { coach: null }
      )
      // Add new coach to new team
      await this.teamModel.findByIdAndUpdate(
        updateCoachDto.team,
        { coach: id }
      )
    }
    return await this.coachModel.findByIdAndUpdate(id, {
      firstName: updateCoachDto.firstName || existing.firstName, 
      lastName: updateCoachDto.lastName || existing.lastName,
      profileUrl: updateCoachDto.profileUrl || existing.profileUrl,
      nationality: updateCoachDto.nationality || existing.nationality,
      dateOfBirth: updateCoachDto.dateOfBirth || existing.dateOfBirth,
      team: updateCoachDto.team || existing.team,
      teamName: updateCoachDto.teamName || existing.teamName,
      crest: updateCoachDto.crest || existing.crest,
      joinedTeam: updateCoachDto.joinedTeam || existing.joinedTeam,
    })
  }

  async remove(id: string) {
    const existing = await this.findByIdWithoutPopulate(id);
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
