import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Team } from 'src/team/entities/team.entity';

// timestamps option can create createdAt / updatedAt automatically
@Schema({ timestamps: true })
export class Coach extends Document {
    @Prop({ required: true })
    firstName: string;
  
    @Prop({ required: true })
    lastName: string;
    
    @Prop()
    profileUrl: string

    @Prop()
    nationality: string

    @Prop()
    dateOfBirth: Date

    @Prop( {type: mongoose.Schema.Types.ObjectId, ref: 'Team'} )
    team: Team

    @Prop()
    teamName: string;

    @Prop()
    crest:string;

    @Prop()
    joinedTeam: Date
}

export const CoachSchema = SchemaFactory.createForClass(Coach);
