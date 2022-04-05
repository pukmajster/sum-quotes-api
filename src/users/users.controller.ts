import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithUser } from 'src/auth/interfaces/auth.interfaces';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    // private authService: AuthService,
  ) { }

  @Get("users/:id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Put("me/update")
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() request: RequestWithUser,
    @Body() newProfile: UpdateProfileDto
  ) {
    return this.usersService.updateProfile(+request.user.id, newProfile)
  }

  // @UseGuards(JwtAuthGuard)
  // @Post("me/update")
  // async logOut(@Req() request: RequestWithUser) {
  //   const user = this.usersService.findOne(request.user.id)
  // }
}


