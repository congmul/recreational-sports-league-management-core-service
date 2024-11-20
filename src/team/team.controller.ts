import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiOperation } from '@nestjs/swagger';
import { isObjectIdOrHexString } from 'mongoose';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Team', description: 'Create a Team' })
  async create(@Body() createTeamDto: CreateTeamDto) {
    try{
      const team = await this.teamService.create(createTeamDto);
      return team;
    }catch(error){
      if(error?.name === 'DuplicatedError'){
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `the team, "${createTeamDto.name}", is already existing`
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
  @ApiOperation({ summary: 'Get all teams', description: 'Get all teams' })
  findAll() {
    return this.teamService.findAll();
  }

  // TODO: get referencing
  @Get(':identifier')
  @ApiOperation({ summary: 'Get a team by an identifier', description: 'Get a team by an identifier' })
  async findOne(@Param('identifier') identifier: string) {
    let team: CreateTeamDto;
    if(isObjectIdOrHexString(identifier)){
      team = await this.teamService.findById(identifier);
    }else{
      team = await this.teamService.findByName(identifier);
    }
    // TEAM NOT FOUND
    if(!team){
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No team found with the provided identifier: ${identifier}`
        },
        HttpStatus.NOT_FOUND,
        {
          cause: `No team found with the provided identifier: ${identifier}`
        }
      )
    }
    return team;
  }

  // TODO: 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team by id', description: 'Delete a team by id' })
  async remove(@Param('id') id: string) {
    try{
      await this.teamService.remove(id);
      return { status: HttpStatus.ACCEPTED, message: 'Team successfully deleted.'}
    }catch(error){
      if(error?.name === 'NotFoundError'){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No team found with the provided ID: ${id}`
          },
          HttpStatus.NOT_FOUND,
          {
            cause: `No team found with the provided ID: ${id}`
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
