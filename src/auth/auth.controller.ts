import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthenticationGuard } from '../guard/local-auth.guard';
import { RequestWithUser } from './interface/request-with-user.interface';
import { JwtAuthenticationGuard } from 'src/guard/jwt-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: User })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto);
  }

  @HttpCode(200)
  @ApiBody({ required: true, type: LoginUserDto })
  @ApiOkResponse({ type: User })
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<User> {
    const user = req.user;
    const cookie = this.authService.getCookieWithJwt(user.id);
    res.setHeader('Set-Cookie', cookie);
    return { ...user, password: undefined };
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    const cookie = this.authService.getCookieForLogout();
    res.setHeader('Set-Cookie', cookie);
    return res.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  auth(@Res() req: RequestWithUser) {
    const user = req.user;
    return { ...user, password: undefined };
  }
}
