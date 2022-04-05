
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/auth.interfaces';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from "bcrypt";
import { CreateUserDto } from './dto/user.dto';
import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    // @InjectRepository(User)
    // private usersRepository: Repository<User>
  ) {}



  public async register(registerData: CreateUserDto) {
    // const hashedPassword = await this.hashPassword(registerData.password,);
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    try {
      const createdUser = await this.usersService.create({
        ...registerData,
        password: hashedPassword,
      });

      createdUser.password == undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
      }

      console.error(error);

      throw new HttpException(
        "Something went wrong",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getCookieWithJwtAccessToken(user: User, isSecondFactorAuthenticated = false) {
    const payload: TokenPayload = { user };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    });
    console.log(token);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
     
  public async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  // public async getUserFromAuthenticationToken(token: string) {
  //   const payload: TokenPayload = this.jwtService.verify(token, {
  //     secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET')
  //   });
  //   if (payload.user.id) {
  //     return this.usersService.getById(payload.user.id);
  //   }
  // }
}
