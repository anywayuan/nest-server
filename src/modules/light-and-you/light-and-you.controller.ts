import { Body, Controller, Get, Post } from '@nestjs/common';
import { LightAndYouService } from './light-and-you.service';
import { Public } from 'src/global/decorator/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAllAlbumResDto } from './dto/get-album.dto';
import { GetPhotosResDto } from './dto/get-photos.dto';
import { GetPhotosReqDto } from './dto/get-photos.dto';

@ApiTags('Sky And You')
@Controller('wxmp')
export class LightAndYouController {
  constructor(private readonly lightAndYouService: LightAndYouService) {}

  @Get('albums')
  @Public()
  @ApiOperation({ summary: '获取相册列表' })
  @ApiResponse({ status: 200, description: 'success', type: GetAllAlbumResDto })
  async getAlbumList() {
    return await this.lightAndYouService.getAlbumList();
  }

  @Post('photos')
  @Public()
  @ApiOperation({ summary: '获取分类下图片资源' })
  @ApiResponse({ status: 200, description: 'success', type: GetPhotosResDto })
  async getPhotosByAlbum(@Body() body: GetPhotosReqDto) {
    return await this.lightAndYouService.getPhotosByAlbum(body);
  }
}
