import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Player } from 'src/player/entities/player.entity';
import { Coach } from 'src/coach/entities/coach.entity';

// timestamps option can create createdAt / updatedAt automatically
@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ unique:true, required: true })
  name: string;

  @Prop()
  establish: Date;

  @Prop()
  homeStadium: string;
  
  @Prop({ type: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Player'} ] })
  players: Player[];

  @Prop({ type: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Coach'} ] })
  coaches: Coach[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
