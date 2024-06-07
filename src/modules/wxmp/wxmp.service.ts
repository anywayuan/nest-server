import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlbumsEntity } from './entities/album.entity';
import { PhotoEntity } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    await this.albumsRepository.save(newAlbum);

    return {};
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
      if (originRow.img_key !== putData.img_key) {
        this.ossService.delFile([originRow].map((i) => ({ key: i.img_key })));
      }
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
    let newKey: string = key;

    const qb = this.photoRepository.createQueryBuilder('photo');
    qb.where('1 = 1');
    qb.andWhere('photo.key = :key', { key });

    const count = await qb.getCount();

    if (count > 0) {
      newKey = new Date().getTime() + '.' + key;
    }

    const newPhoto = this.photoRepository.create({
      pid,
      url,
      key: newKey,
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
   *
   * 编辑时如果更新图片则:
   * 1. 前端需要将新的key（文件名称）传回来。
   * 2. 根据当前id查询到旧key调用oss删除模块删除原图片。
   */
  async editPhoto(id: string, body: Partial<AddPhoto>) {
    const { key } = body;
    const qb = this.photoRepository.createQueryBuilder('photo');
    qb.where('id = :id', { id });
    const record = await qb.getOne();
    // 有 key: 图片重新更新了，删除oss原图片
    if (key) {
      await this.ossService.delFile([{ key: record.key }]);
    }
    // 无 key: 图片无更新
    const res = await qb
      .update(record)
      .set({ ...body })
      .execute();

    if (res.affected === 1) {
      return {};
    }
    throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
  }
}
