import { Module } from '@nestjs/common';
import { LightAndYouService } from './light-and-you.service';
import { LightAndYouController } from './light-and-you.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsEntity } from './entities/album.entity';
import { PhotoEntity } from './entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumsEntity, PhotoEntity])],
  providers: [LightAndYouService],
  controllers: [LightAndYouController],
})
export class LightAndYouModule {}
