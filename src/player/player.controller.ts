import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthAdminGuard } from 'src/auth/jwt-auth-admin.guard';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @UseGuards(JwtAuthAdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new player', description: 'Create a new player' })
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    try{
      return await this.playerService.create(createPlayerDto);
    }catch(error){
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
  @ApiOperation({ summary: 'Get all players', description: 'Get all players' })
  findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a player by an id', description: 'Get a player by an id' })
  async findOne(@Param('id') id: string) {
    try{
      const player = await this.playerService.findById(id);
      // PLAYER NOT FOUND
      if(!player){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No player found with the provided id: ${id}`
          },
          HttpStatus.NOT_FOUND,
          {
            cause: `No player found with the provided id: ${id}`
          }
        )
      }
      return player;
    }catch(error){
      if(error?.name === 'CastError'){
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
  @Patch(':id')
  @ApiOperation({ summary: 'Update a player by an id', description: 'Update a player by an id' })
  async update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    try{
      await this.playerService.update(id, updatePlayerDto);
      return { status: HttpStatus.ACCEPTED, message: 'Player successfully updated.'}
    }catch(error){
      if(error?.name === 'NotFoundError'){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No player found with the provided ID: ${id}`
          },
          HttpStatus.NOT_FOUND,
          {
            cause: `No player found with the provided ID: ${id}`
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
  @ApiOperation({ summary: 'Delete a player by id', description: 'Delete a player by id' })
  async remove(@Param('id') id: string) {
    try{
      await this.playerService.remove(id);
      return { status: HttpStatus.ACCEPTED, message: 'Player successfully deleted.'}
    }catch(error){
      if(error?.name === 'NotFoundError'){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No player found with the provided ID: ${id}`
          },
          HttpStatus.NOT_FOUND,
          {
            cause: `No player found with the provided ID: ${id}`
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
