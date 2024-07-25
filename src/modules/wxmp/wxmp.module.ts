import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WxmpService } from './wxmp.service';
import { WxmpController } from './wxmp.controller';
import { AlbumsEntity } from './entities/album.entity';
import { PhotoEntity } from './entities/photo.entity';
import { OssModule } from '../../oss/oss.module';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumsEntity, PhotoEntity]), OssModule],
  providers: [WxmpService],
  controllers: [WxmpController],
})
export class Wxmp {}
