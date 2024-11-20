import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Team } from "src/team/entities/team.entity";
import { PlayerPosition } from "../player.enum";

export class CreatePlayerDto {
    @ApiProperty({ example: 'heung-min', description: 'firstName of the player' })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'son', description: 'lastName of the player' })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'south korea', description: 'position of the player' })
    @IsString()
    nationality: string

    @ApiProperty({ example: '1992-08-07', description: 'position of the player' })
    @IsString()
    dateOfBirth: Date

    @ApiProperty({ example: 'objectId of a team', description: 'position of the player' })
    @IsMongoId({ message: 'Team must be a valid MongoDB ObjectId' })
    team: Team

    @ApiProperty({ example: '2015-09-13', description: 'joined date of the player' })
    @IsString()
    joinedTeam: Date

    @ApiProperty({ example: 'forward', description: 'position of the player' })
    @IsEnum(PlayerPosition, { message: 'Role must be either goalkeeper, defender, midfielder, or forward' })
    position: PlayerPosition
}
