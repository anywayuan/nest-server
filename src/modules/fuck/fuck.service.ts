import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Fuck } from './entities/fuck.entity';
import { CreateFuckDto } from './dto/create-fuck.dto';
import { UpdateFuckDto } from './dto/update-fuck.dto';

@Injectable()
export class FuckService {
  constructor(
    @InjectRepository(Fuck)
    private fuckRepository: Repository<Fuck>,
  ) {}
  create(createFuckDto: CreateFuckDto) {
    return 'This action adds a new fuck';
  }

  findAll() {
    return `This action returns all fuck`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fuck`;
  }

  update(id: number, updateFuckDto: UpdateFuckDto) {
    return `This action updates a #${id} fuck`;
  }

  remove(id: number) {
    return `This action removes a #${id} fuck`;
  }
}
