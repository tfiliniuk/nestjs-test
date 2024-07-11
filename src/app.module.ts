import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaylistsModule } from './playlists/playlists.module';
import { SongsModule } from './songs/songs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions, typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from './seed/seed.module';
import configuration from './config/configuration';
import { validate } from 'env.validation';

@Module({
  imports: [
    SongsModule,
    PlaylistsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      load: [configuration],
      validate: validate,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST'),
    //     port: configService.get('DB_PORT'),
    //     username: configService.get('DB_USERNAME'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME'),
    //     synchronize: true,
    //     entities: [__dirname + '/**/*.entity{.js, .ts}'],
    //     // entities: [Song, Artist, User, Playlist],
    //   }),
    //   inject: [ConfigService],
    // }),
    // TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log('dbName', dataSource.driver.database);
  }
}
