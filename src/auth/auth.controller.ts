import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  Get,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/user.dto";
import { LoginPayload, RequestWithUser, UpdatePasswordDto } from "./interfaces/auth.interfaces";
import { LocalAuthGuard } from "./local-auth.guard";
import { Request, response, Response } from "express";
import JwtAuthGuard from "./jwt-auth.guard";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';

@Controller("")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post("signup")
  async register(@Body() registrationData: CreateUserDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user);
    console.log('token:', accessTokenCookie);
    
    request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    return {token: accessTokenCookie};
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader("Set-Cookie", this.authService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  // TODO: Implement password changing  
  // @UseGuards(JwtAuthGuard)
  // @Post("update-password")
  // async changePassword(
  //   @Body() data: UpdatePasswordDto,
  //   @Req() request: RequestWithUser,
  // ) {
  //   const user = await this.usersService.findOne(request.user.id);

  //   const validPassword = this.authService.verifyPassword(
  //     data.currentPassword,
  //     user.password,
  //   );

  //   if (!validPassword) {
  //     throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
  //   }

  //   const hashedPassword = await bcrypt.hash(validPassword, 10);
    
  //   await this.usersService.changePassword(hashedPassword, user);
  // }
}
