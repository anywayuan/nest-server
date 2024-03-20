import { Injectable } from '@nestjs/common';
import { AlbumsEntity } from './entities/album.entity';
import { PhotoEntity } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumDto } from './dto/album.dto';
import { GetPhotosReqDto } from './dto/get-photos.dto';
import { QueryAllAlbum } from './dto/get-album.dto';

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

  /**
   * 查询全部分类
   */
  async getAlbumList(params: QueryAllAlbum): Promise<AlbumRes> {
    const { page = 1, page_size = 10, title, del } = params;

    const qb = this.albumsRepository.createQueryBuilder('albums');
    qb.where('1 = 1');
    if (title) {
      qb.andWhere('(albums.title like :title or albums.zh_title like :title)', {
        title: `%${title}%`,
      });
    }
    if (del) {
      qb.andWhere('albums.del = :del', { del });
    }
    qb.limit(page_size);
    qb.offset(page_size * (page - 1));

    const count = await qb.getCount();
    const albums = await qb.getMany();

    return {
      list: albums,
      count,
    };
  }

  /**
   * 根据分类 ID 获取该分类下的图片
   */
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
