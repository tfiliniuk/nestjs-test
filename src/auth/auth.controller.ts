import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { enable2FAType } from 'src/types/types';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { UpdateResult } from 'typeorm';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { JwtAuthGuard } from './guards/jwt-guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  signup(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(userDTO);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'It will give you access_token in the response',
  })
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Request() req): Promise<enable2FAType> {
    console.log('req.user from enable-2fa', req.user);
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Request()
    req,
    @Body()
    validateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validateaFAToken(
      req.user.userId,
      validateTokenDTO.token,
    );
  }

  @Get('disable-2FA')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Request() req): Promise<UpdateResult> {
    return this.authService.disable2FAToken(req.user.userId);
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Request()
    req,
  ) {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }

  @Get('test')
  testEnvVariable() {
    return this.authService.getEnvVariable();
  }
}
