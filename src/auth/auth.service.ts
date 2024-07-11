import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { enable2FAType, PayloadType } from 'src/types/types';
import * as speakeeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
    private configService: ConfigService,
  ) {}
  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordMatched) {
      delete user.password;

      const payload: PayloadType = { email: user.email, userId: user.id };

      const artist = await this.artistsService.findArtist(user.id);

      if (artist) {
        payload.artistId = artist.id;
      }

      if (user.enable2FA && user.twoFASecret) {
        return {
          validate2FA: 'http://localhost:3000/auth/validate-2FA',
          message:
            'Please send the one time password/token from your Goodle Authenticator App',
        };
      }
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }

  async enable2FA(userId: number): Promise<enable2FAType> {
    const user = await this.userService.findById(userId);

    if (user.enable2FA) {
      return {
        secret: user.twoFASecret,
      };
    }

    const secret = speakeeasy.generateSecret();
    console.log('secret', secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(userId, user.twoFASecret);
    return {
      secret: user.twoFASecret,
    };
  }

  async validateaFAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findById(userId);
      // extract his 2FA secret

      // verify the secret with token by calling the speakeasy verify method
      const verified = speakeeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      // if validated then sends the json web token in the response
      if (verified) {
        return {
          verified: true,
        };
      } else {
        return {
          verified: false,
        };
      }
    } catch (error) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async disable2FAToken(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }

  getEnvVariable() {
    return this.configService.get<string>('secret');
  }
}
