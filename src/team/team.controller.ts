import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiOperation } from '@nestjs/swagger';
import { isObjectIdOrHexString } from 'mongoose';
import { JwtAuthAdminGuard } from 'src/auth/jwt-auth-admin.guard';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(JwtAuthAdminGuard)
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

  @Get(':identifier')
  @ApiOperation({ summary: 'Get a team by an identifier', description: 'Get a team by an identifier' })
  async findOne(@Param('identifier') identifier: string, @Query("populate") populate:string) {
    let team: CreateTeamDto;
    if(isObjectIdOrHexString(identifier)){
      if(populate === "without"){
        team = await this.teamService.findByIdWithoutPopulate(identifier);
      }else{
        team = await this.teamService.findById(identifier);
      }
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

  @UseGuards(JwtAuthAdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a team by an identifier', description: 'Update a team by an identifier' })
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    try{ 
      return this.teamService.update(id, updateTeamDto);
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

  @UseGuards(JwtAuthAdminGuard)
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
