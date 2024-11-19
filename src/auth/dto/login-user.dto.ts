
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    @IsString()
    email: string;
  
    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsString()
    password: string;
  }