import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AlbumsEntity } from './entities/album.entity';
import { PhotoEntity } from './entities/photo.entity';
import { AlbumDto } from './dto/album.dto';
import { GetPhotosReqDto } from './dto/get-photos.dto';
import { QueryAllAlbum } from './dto/get-album.dto';
import { AddPhoto, DelPhoto } from './dto/photos.dto';
import { OssService } from '../../oss/oss.service';

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
    private readonly ossService: OssService,
  ) {}

  /** 获取后台路由 */
  async getAdminRoutes() {
    return [
      {
        path: '/albums',
        meta: {
          title: '相册管理',
          icon: 'ep:picture',
          rank: 1,
        },
        children: [
          {
            path: '/albums/classification/index',
            name: 'Classification',
            meta: {
              title: '图片分类',
            },
          },
          {
            path: '/albums/picture/index',
            name: 'Picture',
            meta: {
              title: '图片管理',
            },
          },
        ],
      },
    ];
  }
  /** 根据id查找分类 */
  async findOne(id: string | number) {
    return await this.albumsRepository.findOne({
      where: { id: Number(id) },
    });
  }

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
    const newAlbum = this.albumsRepository.create({
      ...postData,
      create_time: new Date(),
      update_time: new Date(),
    });
    const res = await this.albumsRepository.save(newAlbum);
    const newPhotoParams = {
      pid: res.id,
      url: postData.cover_url,
      key: postData.img_key,
    };
    return this.addPhoto(newPhotoParams);
  }

  /** 更新分类 */
  async updateAlbum(id: string, putData: Partial<AlbumDto>) {
    const originRow = await this.findOne(id);

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
      /** 如果封面更新则删除原oss资源，以及photos中的记录  */
      if (originRow.img_key !== putData.img_key) {
        // 删除原oss资源
        await this.ossService.delFile(
          [originRow].map((i) => ({ key: i.img_key })),
        );
        // 根据 originRow.img_key 更新 photos 中的记录
        await this.photoRepository
          .createQueryBuilder()
          .update(PhotoEntity)
          .set({
            key: putData.img_key,
            url: putData.cover_url,
            update_time: new Date(),
          })
          .where('key = :key', { key: originRow.img_key })
          .execute();
        return {};
      }
      return {};
    }
    throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
  }

  /** 删除分类 */
  async deleteAlbum(id: string) {
    const originRow = await this.findOne(id);

    const res = await this.albumsRepository
      .createQueryBuilder()
      .delete()
      .from(AlbumsEntity)
      .where('id = :id', { id })
      .execute();
    if (res.affected === 1) {
      // 同时删除oss中对应资源 及 photos 表中所有 pid = id 的记录
      await this.ossService.delFile(
        [originRow].map((i) => ({ key: i.img_key })),
      );
      const { list } = await this.getPhotos({ pid: id });
      await this.delPhoto(list);
      return {};
    }
    throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
  }

  /** 根据分类ID查找 */
  async getPhotos(params: GetPhotosReqDto) {
    const { page = 1, page_size = 10, ...conditions } = params;
    const qb = this.photoRepository.createQueryBuilder('photo');
    qb.where('1 = 1');

    const fieldConditions = {
      pid: { field: 'photo.pid', operator: '=' },
      create_time: { field: 'photo.create_time', operator: 'between' },
      update_time: { field: 'photo.update_time', operator: 'between' },
    };

    Object.entries(conditions).forEach(([field, value]) => {
      const condition = fieldConditions[field];
      if (condition) {
        const { field: fieldName, operator } = condition;
        if (
          operator === 'between' &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          // 处理 between 查询条件
          qb.andWhere(`${fieldName} ${operator} :start AND :end`, {
            start: value[0],
            end: value[1],
          });
        } else {
          // 处理其他查询条件
          qb.andWhere(`${fieldName} ${operator} :value`, { value });
        }
      }
    });

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

  /** 管理分类下图片-新增 */
  async addPhoto(postData: AddPhoto) {
    const { pid, url, key } = postData;

    const newPhoto = this.photoRepository.create({
      pid,
      url,
      key,
      create_time: new Date(),
      update_time: new Date(),
    });
    await this.photoRepository.save(newPhoto);

    return {};
  }

  /**
   * 管理分类下图片-删除
   * 1. 根据id删除数据库记录
   * 2. 根据key（文件名）删除 oss 资源
   */
  async delPhoto(body: DelPhoto[]) {
    const ids = body.map((item) => item.id);
    const keys = body.map((item) => {
      return {
        key: item.key,
      };
    });
    try {
      await this.photoRepository
        .createQueryBuilder()
        .delete()
        .from(PhotoEntity)
        .where('id in (:...ids)', { ids })
        .execute();
      await this.ossService.delFile(keys);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
    return {};
  }

  /**
   * 管理分类下图片-编辑
   * 只修改所属分类
   */
  async editPhoto(id: string, body: Partial<AddPhoto>) {
    const qb = this.photoRepository.createQueryBuilder('photo');
    qb.where('id = :id', { id });
    const record = await qb.getOne();

    const res = await qb
      .update(record)
      .set({
        pid: body.pid,
        update_time: new Date(),
      })
      .execute();

    if (res.affected === 1) {
      return {};
    }
    throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
  }
}
