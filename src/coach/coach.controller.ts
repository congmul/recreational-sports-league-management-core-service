import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new coach', description: 'Create a new coach' })
  async create(@Body() createCoachDto: CreateCoachDto) {
    try{
      return await this.coachService.create(createCoachDto);
    }catch(error){
      if(error.name === 'DuplicatedCoachError'){
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            ...error,
            error: `the team, "${createCoachDto.team}", already has a coach`
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
  @ApiOperation({ summary: 'Get all coaches', description: 'Get all coaches' })
  findAll() {
    return this.coachService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coach by id', description: 'Get a coach by id' })
  findOne(@Param('id') id: string) {
    return this.coachService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachService.update(+id, updateCoachDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coach by id', description: 'Delete a coach by id' })
  async remove(@Param('id') id: string) {
    try{
      await this.coachService.remove(id);
      return { status: HttpStatus.ACCEPTED, message: 'Coach successfully deleted.'}
    }catch(error){
      if(error?.name === 'NotFoundError'){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No coach found with the provided ID: ${id}`
          },
          HttpStatus.NOT_FOUND,
          {
            cause: `No coach found with the provided ID: ${id}`
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
