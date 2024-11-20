import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Team } from "src/team/entities/team.entity";

export class CreateCoachDto {
    @ApiProperty({ example: 'ange', description: 'firstName of the coach' })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'postecoglou', description: 'lastName of the coach' })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'australia', description: 'nationality of the coach' })
    @IsString()
    nationality: string

    @ApiProperty({ example: '1965-08-27', description: 'date of birth of the coach' })
    @IsString()
    dateOfBirth: Date

    @ApiProperty({ example: 'objectId of a team', description: 'team of the coach' })
    @IsMongoId({ message: 'Team must be a valid MongoDB ObjectId' })
    @IsOptional()
    team: Team

    @ApiProperty({ example: '2023-07-01', description: 'joined date of the coach' })
    @IsString()
    joinedTeam: Date
}
