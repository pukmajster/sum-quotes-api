import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configService } from './config/config.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import * as Joi from "@hapi/joi";
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { QotdController } from './qotd/qotd.controller';
import { QotdModule } from './qotd/qotd.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    QotdModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
  ],
  controllers: [AppController, QotdController],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
