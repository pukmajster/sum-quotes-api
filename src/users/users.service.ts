import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/user.dto';
import { Like, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/user.dto';

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

  async updateProfile(userId: number, newProfile: UpdateProfileDto) {

    const hashedPassword = await bcrypt.hash(newProfile.password, 10);

    await this.usersRepository.update(userId, {
      password: hashedPassword,
      email: newProfile.email,
      firstName: newProfile.firstName,
      lastName: newProfile.lastName
    })
  }

  // -------------------------------------------------------
  //  Quotes
  // -------------------------------------------------------
  async createQuote(userId: number, quote: string) {
    await this.usersRepository.update(userId, {
      quote,
      score: 0,
      downvotes: [],
      upvotes: [],
      createDateTime: 'now()',
      lastChangedDateTime: 'now()'
    })
  }

  async deleteQuote(userId: number) {
    await this.usersRepository.update(userId, {
      quote: null,
      score: 0,
      downvotes: [],
      upvotes: [],
      createDateTime: 'now()',
      lastChangedDateTime: 'now()'
    })
  }
  
  // Toggles the upvote status of a quote and removes any potential downvote
  async upvoteQuote(userId: number, quoteUserId: number) {
    let quoteUser = await this.usersRepository.findOne(quoteUserId);

    if(quoteUser.quote == null) return;

    // Clear any downvotes
    let downvotes = [...quoteUser.downvotes];
    if(downvotes.includes(userId)) {
      downvotes = downvotes.filter(entry => entry != userId);
    }

    // Toggle the upvote
    let upvotes = [...quoteUser.upvotes];
    if(upvotes.includes(userId)) {
      upvotes = upvotes.filter(entry => entry != userId);
    } else {
      upvotes.push(userId);
    }

    // Calculates the score
    let score = upvotes.length - downvotes.length;

    await this.usersRepository.update(quoteUserId, {
      score,
      downvotes,
      upvotes,
    })
  }

  // Toggles the downvote status of a quote and removes any potential upvote
  async downvoteQuote(userId: number, quoteUserId: number) {
    let quoteUser = await this.usersRepository.findOne(quoteUserId);

    if(quoteUser.quote == null) return;

    // Clear any downvotes
    let upvotes = [...quoteUser.upvotes];
    if(upvotes.includes(userId)) {
      upvotes = upvotes.filter(entry => entry != userId);
    }

    // Toggle the upvote
    let downvotes = [...quoteUser.downvotes];
    if(downvotes.includes(userId)) {
      downvotes = downvotes.filter(entry => entry != userId);
    } else {
      downvotes.push(userId);
    }

    // Calculates the score
    let score = upvotes.length - downvotes.length;

    await this.usersRepository.update(quoteUserId, {
      score,
      downvotes,
      upvotes,
    })
  }

  // Returns 9 of the highest scoring quotes
  async getHightestScoringQuotes() {
    return await this.usersRepository.find({
      where: { quote: Like("%") },
      order: { score: "DESC" },
      take: 9
    });
  }

  async getLatestQuotes() {
    return await this.usersRepository.find({
      where: { quote: Like("%") },
      order: { createDateTime: "DESC" },
      take: 9
    });
  }

  async getLikedQuotes(userId: number,) {
    return await this.usersRepository.createQueryBuilder()
    .where('users.upvotes && :upvotes', { upvotes: userId })
    .take(9)
  }

  // async setCurrentRefreshToken(refreshToken: string, userId: number) {
  //   const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  //   await this.usersRepository.update(userId, {

  //     // @ts-expect-error
  //     currentHashedRefreshToken
  //   });
  // }
}
