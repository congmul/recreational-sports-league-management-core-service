import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isObjectIdOrHexString } from 'mongoose';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user', description: 'Create a user' })
  async create(@Body() createUserDto: CreateUserDto) {
    try{
      const user = await this.userService.create(createUserDto);
      // Omit Password before returning it.
      const { password, ...rest } = user.toObject();
      return rest;
    }catch(error){
      // Validation Error
      if(error?.name === 'ValidationError'){
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error
          },
          HttpStatus.BAD_REQUEST, 
          {
            cause: error
          }
        )
      }
      // Email Already Existing
      else if(error?.name === 'DuplicatedError'){
        throw new HttpException(
          {
            // TODO: need to find correct httpStatus
            status: HttpStatus.CONFLICT,
            error: `the email, "${createUserDto.email}", is already existing`
          },
          HttpStatus.CONFLICT, 
          {
            cause: error
          }
        )
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error
        },
        HttpStatus.INTERNAL_SERVER_ERROR, 
        {
          cause: error
        }
      )
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Get all users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get a user by an identifier', description: 'Get a user by an identifier. Identifier will be Mongo Id or email' })
  async findOne(@Param('identifier') identifier: string) {
    let user: Omit<CreateUserDto, 'password'>;
    if(isEmail(identifier)){
      user = await this.userService.findByEmail(identifier);      
    }else{
      // INVALID MONGO ID
      if(!isObjectIdOrHexString(identifier)){
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `The provided identifier is not a valid MongoDB ObjectID or email: ${identifier}`
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: `The provided identifier is not a valid MongoDB ObjectID or email: ${identifier}`
          }
        )
      }
      user = await this.userService.findById(identifier);
    }

    // USER NOT FOUND
    if(!user){
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No user found with the provided identifier: ${identifier}`
        },
        HttpStatus.NOT_FOUND,
        {
          cause: `No user found with the provided identifier: ${identifier}`
        }
      )
    }

    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id', description: 'Update a user by id' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try{
      await this.userService.update(id, updateUserDto);
      return { status: HttpStatus.ACCEPTED, message: 'User successfully updated.'}
    }catch(error){
      if(error?.name === 'NotFoundError'){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No user found with the provided ID: ${id}`
          },
          HttpStatus.NOT_FOUND,
          {
            cause: `No user found with the provided ID: ${id}`
          }
        )
      }else if(error?.name === 'CastError'){
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error
          }
        )
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error
        },
        HttpStatus.INTERNAL_SERVER_ERROR, 
        {
          cause: error
        }
      )

    }    
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id', description: 'Delete a user by id' })
  async remove(@Param('id') id: string) {
    try{
      await this.userService.remove(id);
      return { status: HttpStatus.ACCEPTED, message: 'User successfully deleted.'}
    }catch(error){
      if(error?.name === 'NotFoundError'){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No user found with the provided ID: ${id}`
          },
          HttpStatus.NOT_FOUND,
          {
            cause: `No user found with the provided ID: ${id}`
          }
        )
      }else if(error?.name === 'CastError'){
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error
          }
        )
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error
        },
        HttpStatus.INTERNAL_SERVER_ERROR, 
        {
          cause: error
        }
      )
    }
  }
}
