import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from '../team/entities/team.entity';
import { Player, PlayerSchema } from '../player/entities/player.entity';
import { Coach, CoachSchema } from '../coach/entities/coach.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Coach.name, schema: CoachSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}