import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
  ) {}
  private readonly songs = [];

  async create(songDTO: CreateSongDto): Promise<Song> {
    const newSong = new Song();
    newSong.title = songDTO.title;
    // newSong.artists = songDTO.artists;
    newSong.duration = songDTO.duration;
    newSong.lyrics = songDTO.lyrics;
    newSong.releasedDate = songDTO.releasedDate;

    // find all the artits on the based on ids
    const artists = await this.artistsRepository.findByIds(songDTO.artists);

    const playlist = await this.playlistsRepository.findOneBy({
      id: songDTO.playlistId,
    });
    //set the relation with artist and songs
    newSong.artists = artists;

    newSong.playList = playlist;

    return this.songsRepository.save(newSong);
  }

  findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  findOne(id: number): Promise<Song> {
    return this.songsRepository.findOneBy({ id });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.songsRepository.delete(id);
  }

  update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
    return this.songsRepository.update(id, recordToUpdate);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    // Sorting
    // const queryBuilder = this.songsRepository.createQueryBuilder('c');
    // queryBuilder.orderBy('c.releasedDate', 'DESC')

    // return paginate<Song>(queryBuilder, options);
    return paginate<Song>(this.songsRepository, options);
  }
}
