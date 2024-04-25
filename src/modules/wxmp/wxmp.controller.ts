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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryAllAlbum } from './dto/get-album.dto';
import { GetPhotosReqDto } from './dto/get-photos.dto';
import { AlbumDto } from './dto/album.dto';
import { AddPhoto, DelPhoto } from './dto/photos.dto';
@ApiTags('wxmp')
@Controller('wxmp')
export class WxmpController {
  constructor(private readonly wxmpService: WxmpService) {}

  @Get('albums')
  @Public()
  @ApiOperation({ summary: '图片分类' })
  async getAlbumList(@Query() params: QueryAllAlbum) {
    return await this.wxmpService.getAlbumList(params);
  }

  @Post('albums')
  @ApiOperation({ summary: '添加分类' })
  async addAlbum(@Body() body: AlbumDto) {
    return await this.wxmpService.addAlbum(body);
  }

  @Put('albums/:id')
  @ApiOperation({ summary: '更新分类' })
  async updateAlbum(@Param('id') id: string, @Body() body: Partial<AlbumDto>) {
    return await this.wxmpService.updateAlbum(id, body);
  }

  @Delete('albums/:id')
  @ApiOperation({ summary: '删除分类' })
  async deleteAlbum(@Param('id') id: string) {
    return await this.wxmpService.deleteAlbum(id);
  }

  /** 管理分类下图片-列表 */
  @Get('photos')
  @Public()
  @ApiOperation({ summary: '根据分类获取图片' })
  async getPhotos(@Query() params: GetPhotosReqDto) {
    return await this.wxmpService.getPhotos(params);
  }

  /** 管理分类下图片-新增 */
  @Post('photos')
  async addPhoto(@Body() body: AddPhoto) {
    return this.wxmpService.addPhoto(body);
  }

  /** 管理分类下图片-删除 */
  @Delete('photos')
  async delPhoto(@Body() body: DelPhoto[]) {
    return this.wxmpService.delPhoto(body);
  }

  /** 管理分类下图片-编辑 */
  @Put('photos/:id')
  async updatePhoto(@Param('id') id: string, @Body() body: Partial<AddPhoto>) {
    return this.wxmpService.editPhoto(id, body);
  }

  @Get('admin/routes')
  async getAdminRoutes() {
    return await this.wxmpService.getAdminRoutes();
  }
}
