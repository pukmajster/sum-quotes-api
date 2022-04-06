import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithUser } from 'src/auth/interfaces/auth.interfaces';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import { CreateQuoteDto, UpdateProfileDto } from './dto/user.dto';
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

  @Post("quote")
  @UseGuards(JwtAuthGuard)
  createQuote(
    @Req() request: RequestWithUser,
    @Body() quote: CreateQuoteDto
  ) {
    return this.usersService.createQuote(+request.user.id, quote.quote)
  }

  @Delete("quote")
  @UseGuards(JwtAuthGuard)
  deleteQuote(
    @Req() request: RequestWithUser
  ) {
    return this.usersService.deleteQuote(+request.user.id)
  }


  // @UseGuards(JwtAuthGuard)
  // @Post("me/update")
  // async logOut(@Req() request: RequestWithUser) {
  //   const user = this.usersService.findOne(request.user.id)
  // }
}


