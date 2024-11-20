import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsMongoId, IsNotEmpty, IsOptional, Max, Min } from "class-validator";
import { Coach } from "src/coach/entities/coach.entity";
import { Player } from "src/player/entities/player.entity";

export class CreateTeamDto {
    @ApiProperty({ example: 'Tottenham Hotspur', description: 'Name of the team' })
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({ example: '1882', description: 'Year the team was established' })
    @IsInt()
    @Min(1800) // Example: Minimum year allowed
    @Max(new Date().getFullYear()) // Maximum is the current year
    establish: Date;
  
    @ApiProperty({ example: 'Tottenham Hotspur Stadium', description: 'Home stadium of the team' })
    @IsNotEmpty()
    homeStadium: string;
    
    @ApiProperty({ example: ['objectId of a player'], description: 'Players', isArray: true })
    @IsMongoId({ each: true, message: 'Each player ID must be a valid MongoDB ObjectId' }) // Validates each element in the array
    @IsOptional()
    players: Player[];

    @ApiProperty({ example: 35, description: 'max number of players' })
    @IsInt()
    @IsOptional()
    maxNumber: number

    @ApiProperty({ example: 'objectId of a coach', description: 'Coach' })
    @IsMongoId({ message: 'Coach must be a valid MongoDB ObjectId' })
    @IsOptional()
    coach?: Coach;
}
