import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepo: Repository<Playlist>,

    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(playListDTO: CreatePlaylistDto): Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = playListDTO.name;

    // songs will be the array of ids that we are getting from the DTO object
    const songs = await this.songRepository.findByIds(playListDTO.songs);
    // set the relation for the songs with playlist entity
    playlist.songs = songs;

    // A user will be the id of the user we are getting from the request
    // when we implemented the user authentication this id will become the loggedIn user id
    const user = await this.userRepository.findOneBy({
      id: playListDTO.user,
    });
    playlist.user = user;

    return this.playListRepo.save(playlist);
  }
}
