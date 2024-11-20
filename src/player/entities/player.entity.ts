import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Team } from 'src/team/entities/team.entity';

// timestamps option can create createdAt / updatedAt automatically
@Schema({ timestamps: true })
export class Player extends Document {
    @Prop({ required: true })
    firstName: string;
  
    @Prop({ required: true })
    lastName: string;

    @Prop()
    nationality: string

    @Prop()
    dateOfBirth: Date

    @Prop( {type: mongoose.Schema.Types.ObjectId, ref: 'Team'} )
    team: Team

    @Prop()
    joinedTeam: Date

    @Prop()
    position: string
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
