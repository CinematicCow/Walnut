import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interface/token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = bcrypt.hashSync(registerUserDto.password, 10);
    try {
      const createdUser = await this.userService.create({
        ...registerUserDto,
        password: hashedPassword,
      });
      return { ...createdUser, password: undefined };
    } catch (err) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthenticatedUser(loginUserDto: LoginUserDto): Promise<User> {
    try {
      console.log(loginUserDto);
      const user = await this.userService.findByEmail(loginUserDto.email);
      console.log(user);
      await this.checkPassword(loginUserDto.password, user.password);
      console.log('check pass called');
      return { ...user, password: undefined };
    } catch (err) {
      throw new UnauthorizedException('Invalid Credential');
    }
  }

  private async checkPassword(
    pass: string,
    hashedPass: string,
  ): Promise<boolean> {
    const isPassMatch = await bcrypt.compare(pass, hashedPass);
    console.log(isPassMatch);
    if (!isPassMatch) throw new UnauthorizedException('Invalid Credentials');
    return true;
  }

  getCookieWithJwt(id: string) {
    const payload: TokenPayload = { id };
    const token = this.jwtService.sign(payload);
    return `Authentication:${token}; HttpOnly; Max-Age:${process.env.JWT_SECRET_TIME}`;
  }

  getCookieForLogout() {
    return `Authentication=;HttpOnly;Max-Age=0`;
  }
}
