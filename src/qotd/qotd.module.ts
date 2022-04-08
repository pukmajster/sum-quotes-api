import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { QotdController } from './qotd.controller';
import { QotdService } from './qotd.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qotd } from './qotd.entity';
import { UsersModule } from 'src/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([Qotd]), ScheduleModule.forRoot(), UsersModule],
  providers: [QotdService],
  controllers: [QotdController],
  exports: [QotdService]
})
export class QotdModule {}
