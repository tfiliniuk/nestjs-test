import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/artists/artist.entity';
import { LoggerMiddleware } from 'src/common/middleware/logger/logger.middleware';
import { Playlist } from 'src/playlists/playlist.entity';
import { Song } from './song.entity';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist, Playlist])],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs');
    // consumer.apply(LoggerMiddleware).forRoutes({
    //   path: 'songs',
    //   method: RequestMethod.POST,
    // });
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
