import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CoachController } from './coach.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coach, CoachSchema } from './entities/coach.entity';
import { Team, TeamSchema } from 'src/team/entities/team.entity';

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Coach.name, schema: CoachSchema }]),
    MongooseModule.forFeature([ { name: Team.name, schema: TeamSchema }])
  ],
  controllers: [CoachController],
  providers: [CoachService],
})
export class CoachModule {}
