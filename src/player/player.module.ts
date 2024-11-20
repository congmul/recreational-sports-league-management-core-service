import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './entities/player.entity';
import { TeamModule } from '../team/team.module'; // Import TeamModule to use teamModel
import { Team, TeamSchema } from 'src/team/entities/team.entity';

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Player.name, schema: PlayerSchema }]),
    MongooseModule.forFeature([ { name: Team.name, schema: TeamSchema }])
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
