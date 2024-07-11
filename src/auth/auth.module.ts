import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { ArtistsModule } from 'src/artists/artists.module';
import { ApiKeyStrategy } from './api-key-strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (consigService: ConfigService) => ({
        secret: consigService.get('secret'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    ArtistsModule,
  ],
  providers: [AuthService, JwtStrategy, ApiKeyStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
