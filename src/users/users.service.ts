import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // findAll(): Promise<User[]> {
  //   return this.usersRepository.find();
  // }

  async findOne(id: number){
    return this.usersRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      user.password = null;
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async changePassword(newPassword: string, user: User) {
    user.password = newPassword;

    await this.usersRepository.save(user);
  }

  // async setCurrentRefreshToken(refreshToken: string, userId: number) {
  //   const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  //   await this.usersRepository.update(userId, {

  //     // @ts-expect-error
  //     currentHashedRefreshToken
  //   });
  // }
}
