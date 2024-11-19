import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'John', description: 'First name of the user' })
    @IsString()
    @IsOptional()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiProperty({ example: 'member', description: 'Role of the user' })
    @IsEnum(UserRole, { message: 'Role must be either admin or member' })
    role: UserRole
}
