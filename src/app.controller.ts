
import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async welcome() {
    return 'hi';
  }

  @Get('quotes/hightest-scoring')
  async getHighestScoringQuotes() {
    return this.usersService.getHightestScoringQuotes();
  }

  @Get('quotes/latest')
  async getLatestQuotes() {
    return this.usersService.getHightestScoringQuotes();
  }
  
}
