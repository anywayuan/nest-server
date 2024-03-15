import { Injectable } from '@nestjs/common';
import { AlbumsEntity } from './entities/album.entity';
import { PhotoEntity } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumDto } from './dto/album.dto';
import { GetPhotosReqDto } from './dto/get-photos.dto';

export interface AlbumRes {
  list: AlbumDto[];
  count: number;
}

@Injectable()
export class WxmpService {
  constructor(
    @InjectRepository(AlbumsEntity)
    private albumsRepository: Repository<AlbumsEntity>,
    @InjectRepository(PhotoEntity)
    private photoRepository: Repository<PhotoEntity>,
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

  // 获取分类下图片资源
  async getPhotosByAlbum(params: GetPhotosReqDto) {
    const { page = 1, page_size = 10, pid } = params;
    const qb = this.photoRepository.createQueryBuilder('photo');
    qb.where('1 = 1');
    qb.andWhere('photo.pid = :pid', { pid });
    qb.orderBy('photo.create_time', 'DESC');

    const count = await qb.getCount();
    const photos = await qb
      .limit(page_size)
      .offset(page_size * (page - 1))
      .getMany();

    return {
      list: photos,
      count,
    };
  }

  // 获取后台路由
  async getAdminRoutes() {
    return {
      data: [],
    };
  }
}
