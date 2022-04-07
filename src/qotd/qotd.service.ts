import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateQotdDto } from './dto/qotd.dto';
import { Qotd } from './qotd.entity';

@Injectable()
export class QotdService {

  constructor(
    @InjectRepository(Qotd)
    private qotdRepository: Repository<Qotd>,

    private usersService: UsersService,
    // private usersRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(QotdService.name);

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  handleCron() {
    this.createNewQotd();
  }

  async create(createQotdDto: CreateQotdDto) {
    const qotd = this.qotdRepository.create(createQotdDto);
    await this.qotdRepository.save(qotd);
    return qotd;
  }

  async createNewQotd() {
    try {
      const randomQuote = await this.usersService.getRandomQuote()
      console.log(randomQuote.id);

      // if(randomQuote?.id == null) return;

      const qotd = await this.create({ quoteId: randomQuote.id })

      console.log(qotd);

      return qotd.id;
    } catch(e) {
      console.log(e);
    }
  }

  async getLatestQotd() {
    const quote = await this.qotdRepository.createQueryBuilder('qotd')
    .orderBy('"createDateTime"', 'DESC')
    .getOne();

    return quote;
  }
}
