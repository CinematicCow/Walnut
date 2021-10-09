import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { TokenPayload } from '../interface/token.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const data = req?.cookies?.authJwt;
          // //(data);
          if (!data) return null;
          //(data);
          return data;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    //('jwt strat const called');
  }

  async validate(payload: TokenPayload) {
    return this.userService.findByID(payload.id);
  }
}
