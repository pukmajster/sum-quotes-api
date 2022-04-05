import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithUser } from 'src/auth/interfaces/auth.interfaces';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
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

  // @UseGuards(JwtAuthGuard)
  // @Post("me/update")
  // async logOut(@Req() request: RequestWithUser) {
  //   const user = this.usersService.findOne(request.user.id)
  // }
}


