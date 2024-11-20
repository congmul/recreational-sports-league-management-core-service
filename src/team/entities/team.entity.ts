import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Player } from 'src/player/entities/player.entity';
import { Coach } from 'src/coach/entities/coach.entity';

// timestamps option can create createdAt / updatedAt automatically
@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ unique:true, required: true })
  name: string;

  @Prop({
    type: Date,
    set: (value: number | string) => new Date(`${value}-01-01T00:00:00Z`), // Store as a date object
    get: (value: Date) => value.getFullYear(), // Retrieve only the year
  })
  establish: Date;

  @Prop()
  homeStadium: string;
  
  @Prop({ 
    type: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Player'} ],
    validate: {
      validator: function (players: mongoose.Types.ObjectId[]) {
        return players.length <= this.maxNumber;
      },
      message: 'Players exceed the maximum allowed number'
    }
  })
  players: Player[];

  @Prop({ required: true, min: 1, max: 50, default: 35 }) // Example limit: 1 to 50
  maxNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coach' })
  coach: Coach;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
