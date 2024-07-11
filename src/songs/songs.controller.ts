import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJWTGuard } from 'src/auth/guards/artists-jwt-guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './song.entity';
import { SongsService } from './songs.service';

@Controller('songs')
@ApiTags('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get()
  findAllWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({ page, limit });
  }

  @Get()
  findAll(): Promise<Song[]> {
    try {
      return this.songsService.findAll();
    } catch (error) {
      throw new HttpException(
        'server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Post()
  @UseGuards(ArtistJWTGuard)
  create(@Body() createSong: CreateSongDto, @Request() req): Promise<Song> {
    console.log('from song controller', req.user);
    return this.songsService.create(createSong);
  }

  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedSong: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updatedSong);
  }

  @Delete(':id')
  delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }
}
