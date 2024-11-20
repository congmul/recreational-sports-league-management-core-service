import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CoachController } from './coach.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coach, CoachSchema } from './entities/coach.entity';

@Module({
  imports: [MongooseModule.forFeature([ { name: Coach.name, schema: CoachSchema }])],
  controllers: [CoachController],
  providers: [CoachService],
})
export class CoachModule {}
