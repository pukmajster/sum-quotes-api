import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
}
