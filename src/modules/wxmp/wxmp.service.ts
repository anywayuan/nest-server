import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  /** 查询全部分类 */
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

  /** 根据分类ID查找 */
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

  /** 获取后台路由 */
  async getAdminRoutes() {
    return {
      data: [],
    };
  }

  /** 新增分类 */
  async addAlbum(postData: AlbumDto) {
    const { title, zh_title } = postData;
    const qb = this.albumsRepository.createQueryBuilder('albums');
    qb.where('1 = 1');
    qb.andWhere('(albums.title = :title or albums.zh_title = :zh_title)', {
      title,
      zh_title,
    });
    const count = await qb.getCount();
    if (count > 0) {
      throw new HttpException('分类已存在', HttpStatus.BAD_REQUEST);
    }
    const newAlbum = await this.albumsRepository.create({
      ...postData,
      create_time: new Date(),
      update_time: new Date(),
    });
    await this.albumsRepository.save(newAlbum);

    return {};
  }

  /** 更新分类 */
  async updateAlbum(id: string, putData: Partial<AlbumDto>) {
    const res = await this.albumsRepository
      .createQueryBuilder()
      .update(AlbumsEntity)
      .set({
        ...putData,
        update_time: new Date(),
      })
      .where('id = :id', { id })
      .execute();
    if (res.affected === 1) {
      return {};
    }
    throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
  }

  /** 删除分类 */
  async deleteAlbum(id: string) {
    const res = await this.albumsRepository
      .createQueryBuilder()
      .delete()
      .from(AlbumsEntity)
      .where('id = :id', { id })
      .execute();
    if (res.affected === 1) {
      return {};
    }
    throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
  }
}
