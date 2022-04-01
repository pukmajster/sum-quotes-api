import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/user.dto";
import { RequestWithUser } from "./interfaces/auth.interfaces";
import { LocalAuthGuard } from "./local-auth.guard";
import { Request, Response } from "express";
import JwtAuthGuard from "./jwt-auth.guard";

@Controller("")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  async register(@Body() registrationData: CreateUserDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const {user} = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader("Set-Cookie", this.authService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthGuard)
  // @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
