import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FuckEntity } from './entities/fuck.entity';
import { CreateFuckDto } from './dto/create-fuck.dto';
import { UpdateFuckDto } from './dto/update-fuck.dto';

@Injectable()
export class FuckService {
  constructor(
    @InjectRepository(FuckEntity)
    private fuckRepository: Repository<FuckEntity>,
  ) {}

  async create(createFuck: CreateFuckDto) {
    const { text } = createFuck;
    const existText = await this.fuckRepository.findOne({
      where: { text },
    });
    if (existText) {
      throw new HttpException('该记录已存在', HttpStatus.CONFLICT);
    }
    const newText = await this.fuckRepository.create(createFuck);
    return await this.fuckRepository.save(newText);
  }

  findAll() {
    return `This action returns all fuck`;
  }

  findRandomOne() {
    const qb = this.fuckRepository
      .createQueryBuilder('fuck')
      .orderBy('RAND()')
      .getOne();
    return qb;
  }

  async update(id: number, updateFuckDto: UpdateFuckDto) {
    const res = await this.fuckRepository
      .createQueryBuilder()
      .update(FuckEntity)
      .set(updateFuckDto)
      .where('id = :id', { id })
      .execute();
    if (res.affected === 1) {
      const existText = await this.fuckRepository.findOne({
        where: { id },
      });
      return existText;
    }
    throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
  }

  async remove(id: number) {
    const existPost = await this.fuckRepository.findOne({
      where: { id },
    });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.NOT_FOUND);
    }
    await this.fuckRepository.remove(existPost);
    return {};
  }
}
