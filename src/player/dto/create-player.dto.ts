import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Team } from "src/team/entities/team.entity";
import { PlayerPosition } from "../player.enum";

export class CreatePlayerDto {
    @ApiProperty({ example: 'heung-min', description: 'firstName of the player' })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'son', description: 'lastName of the player' })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'https://crests.football-data.org/73.png', description: 'url link of the player' })
    @IsString()
    @IsOptional()
    profileUrl: string;

    @ApiProperty({ example: '7', description: 'shirt number of the player' })
    @IsNumber()
    @IsNotEmpty()
    shirtNumber: number

    @ApiProperty({ example: 'south korea', description: 'nationality of the player' })
    @IsString()
    @IsNotEmpty()
    nationality: string

    @ApiProperty({ example: '1992-08-07', description: 'date of birth of the player' })
    @IsString()
    dateOfBirth: Date

    @ApiProperty({ example: 'objectId of a team', description: 'team of the player' })
    @IsMongoId({ message: 'Team must be a valid MongoDB ObjectId' })
    @IsOptional()
    team: Team

    @ApiProperty({ example: '2015-09-13', description: 'joined date of the player' })
    @IsString()
    joinedTeam: Date

    @ApiProperty({ example: 'Left Winger', description: 'section of the player' })
    @IsString()
    @IsOptional()
    section: string

    @ApiProperty({ example: 'forward', description: 'position of the player' })
    @IsEnum(PlayerPosition, { message: 'Position must be either goalkeeper, defender, midfielder, or forward' })
    position: PlayerPosition
}
