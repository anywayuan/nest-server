import { Injectable } from '@nestjs/common';
import { AlbumsEntity } from './entities/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumDto } from './dto/album.dto';

export interface AlbumRes {
  list: AlbumDto[];
  count: number;
}

@Injectable()
export class LightAndYouService {
  constructor(
    @InjectRepository(AlbumsEntity)
    private albumsRepository: Repository<AlbumsEntity>,
  ) {}

  // 获取相册列表
  async getAlbumList(): Promise<AlbumRes> {
    const qb = this.albumsRepository.createQueryBuilder('albums');
    qb.where('1 = 1');

    const count = await qb.getCount();
    const albums = await qb.getMany();

    return {
      list: albums,
      count,
    };
  }
}
