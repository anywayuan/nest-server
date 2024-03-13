import { Module } from '@nestjs/common';
import { WxmpService } from './wxmp.service';
import { WxmpController } from './wxmp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsEntity } from './entities/album.entity';
import { PhotoEntity } from './entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumsEntity, PhotoEntity])],
  providers: [WxmpService],
  controllers: [WxmpController],
})
export class Wxmp {}
