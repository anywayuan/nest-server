import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface UserRo {
  list: User[];
  count: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }

  async findAll(query): Promise<UserRo> {
    const qb = this.userRepository.createQueryBuilder('user');
    qb.where('1 = 1');
    qb.orderBy('user.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10 } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
    const users = await qb.getMany();

    return { list: users, count: count };
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const res = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id })
      .execute();
    if (res.affected === 1) {
      return {};
    }
    throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
  }

  async remove(id: string) {
    const res = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ status: 2 })
      .where('id = :id', { id })
      .execute();
    if (res.affected === 1) {
      return {};
    }
    throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
  }
}
