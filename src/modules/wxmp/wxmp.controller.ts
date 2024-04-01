import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { WxmpService } from './wxmp.service';
import { Public } from 'src/global/decorator/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAllAlbumResDto, QueryAllAlbum } from './dto/get-album.dto';
import { GetPhotosResDto } from './dto/get-photos.dto';
import { GetPhotosReqDto } from './dto/get-photos.dto';
import { AlbumDto, CreateAlbumsResDto } from './dto/album.dto';

@ApiTags('wxmp')
@Controller('wxmp')
export class WxmpController {
  constructor(private readonly wxmpService: WxmpService) {}

  @Get('albums')
  @Public()
  @ApiOperation({ summary: '图片分类' })
  @ApiResponse({ status: 200, description: 'success', type: GetAllAlbumResDto })
  async getAlbumList(@Query() params: QueryAllAlbum) {
    return await this.wxmpService.getAlbumList(params);
  }

  @Post('albums')
  @ApiOperation({ summary: '添加分类' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: CreateAlbumsResDto,
  })
  async addAlbum(@Body() body: AlbumDto) {
    return await this.wxmpService.addAlbum(body);
  }

  @Put('albums/:id')
  @ApiOperation({ summary: '更新分类' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: CreateAlbumsResDto,
  })
  async updateAlbum(@Param('id') id: string, @Body() body: AlbumDto) {
    return await this.wxmpService.updateAlbum(id, body);
  }

  @Delete('albums/:id')
  @ApiOperation({ summary: '删除分类' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: CreateAlbumsResDto,
  })
  async deleteAlbum(@Param('id') id: string) {
    return await this.wxmpService.deleteAlbum(id);
  }

  @Post('photos')
  @Public()
  @ApiOperation({ summary: '根据分类获取' })
  @ApiResponse({ status: 200, description: 'success', type: GetPhotosResDto })
  async getPhotosByAlbum(@Body() body: GetPhotosReqDto) {
    return await this.wxmpService.getPhotosByAlbum(body);
  }

  @Get('admin/routes')
  async getAdminRoutes() {
    return await this.wxmpService.getAdminRoutes();
  }
}
