
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/auth.interfaces';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      "JWT_EXPIRATION_TIME",
    )}`;
  }

  public async hashPassword(password: string) {
    return bcrypt.hash(password, 8);
  }

  

/*   async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  } 

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }*/
}
