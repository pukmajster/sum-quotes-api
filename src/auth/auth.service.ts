
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

  // async getByEmail(email: string) {
  //   const user = await this.usersRepository.findOne({ email });
  //   if (user) {
  //     return user;
  //   }
  //   throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  // }
 
  // async create(userData: CreateUserDto) {
  //   const newUser = await this.usersRepository.create(userData);
  //   await this.usersRepository.save(newUser);
  //   return newUser;
  // }

  // public getCookieWithJwtToken(userId: number) {
  //   const payload: TokenPayload = { userId };

  //   const token = this.jwtService.sign(payload);
  //   return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
  //     "JWT_EXPIRATION_TIME",
  //   )}`;
  // }




  // public async hashPassword(password: string) {
  //   return bcrypt.hash(password, 8);
  // }

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

  public getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return {
      cookie,
      token
    }
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

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET')
    });
    if (payload.userId) {
      return this.usersService.getById(payload.userId);
    }
  }

  // async getById(id: number) {
  //   const user = await this.usersRepository.findOne({ id });
  //   if (user) {
  //     return user;
  //   }
  //   throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  // }

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
