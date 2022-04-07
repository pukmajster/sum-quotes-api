import { Controller, Get, Inject, Post } from '@nestjs/common';
import { QotdService } from './qotd.service';

@Controller('qotd')
export class QotdController {

  constructor(
    // @Inject(QotdService)
    private readonly qotdService: QotdService,
  ) { }

  @Get('/')
  getQotd() {
    return this.qotdService.getLatestQotd();
  }

  @Post('/')
  createQotd() {
    return this.qotdService.createNewQotd();
  }
}
