
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
