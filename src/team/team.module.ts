import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './entities/team.entity';
import { Coach, CoachSchema } from '../coach/entities/coach.entity';
import { Player, PlayerSchema } from 'src/player/entities/player.entity';

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([ { name: Player.name, schema: PlayerSchema }]),
    MongooseModule.forFeature([ { name: Coach.name, schema: CoachSchema }]),
  ],
  controllers: [TeamController],
  providers: [TeamService],  
  exports: [MongooseModule], // Export MongooseModule to make Coach model available
})
export class TeamModule {}
