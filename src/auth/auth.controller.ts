import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/user.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RequestWithUser } from "./interfaces/auth.interfaces";

@Controller("")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  async register(@Body() registrationData: CreateUserDto) {
    return this.authService.register(registrationData);
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
