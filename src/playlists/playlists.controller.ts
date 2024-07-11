import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './playlist.entity';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
@ApiTags('playlists')
export class PlaylistsController {
  constructor(private playlistService: PlaylistsService) {}
  @Post()
  create(@Body() playlistDTO: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistService.create(playlistDTO);
  }
}
