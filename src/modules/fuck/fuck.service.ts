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
    const newText = this.fuckRepository.create(createFuck);
    return await this.fuckRepository.save(newText);
  }

  async findAll(params: { page: number; page_size: number }) {
    const { page = 1, page_size = 10 } = params;
    const qb = this.fuckRepository.createQueryBuilder('fuck');
    qb.where('1 = 1');
    qb.orderBy('fuck.id', 'DESC');
    qb.skip((page - 1) * page_size);
    qb.take(page_size);
    const [list, total] = await qb.getManyAndCount();
    return {
      list,
      total,
    };
  }

  async findRandomOne(params: { ids: number[] }) {
    const { ids } = params;
    const qb = this.fuckRepository.createQueryBuilder('fuck');
    const count = await qb.getCount();
    const res = await qb
      .where('id not in (:ids)', { ids })
      .orderBy('RAND()')
      .getOne();

    return {
      count,
      data: res,
    };
  }

  async update(id: number, updateFuckDto: UpdateFuckDto) {
    const res = await this.fuckRepository
      .createQueryBuilder()
      .update(FuckEntity)
      .set(updateFuckDto)
      .where('id = :id', { id })
      .execute();
    if (res.affected === 1) {
      return {};
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
