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
import { Public } from 'src/global/decorator/public.decorator';
import { WxmpService } from './wxmp.service';
import { QueryAllAlbum } from './dto/get-album.dto';
import { GetPhotosReqDto } from './dto/get-photos.dto';
import { AlbumDto } from './dto/album.dto';
import { AddPhoto, DelPhoto } from './dto/photos.dto';

@Controller('wxmp')
export class WxmpController {
  constructor(private readonly wxmpService: WxmpService) {}

  /** 获取分类 */
  @Get('albums')
  @Public()
  async getAlbumList(@Query() params: QueryAllAlbum) {
    return await this.wxmpService.getAlbumList(params);
  }

  /** 添加分类 */
  @Post('albums')
  async addAlbum(@Body() body: AlbumDto) {
    return await this.wxmpService.addAlbum(body);
  }

  /** 更新分类 */
  @Put('albums/:id')
  async updateAlbum(@Param('id') id: string, @Body() body: Partial<AlbumDto>) {
    return await this.wxmpService.updateAlbum(id, body);
  }

  /** 删除分类 */
  @Delete('albums/:id')
  async deleteAlbum(@Param('id') id: string) {
    return await this.wxmpService.deleteAlbum(id);
  }

  /** 管理分类下图片-列表 */
  @Get('photos')
  @Public()
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

  /** 路由菜单 */
  @Get('admin/routes')
  async getAdminRoutes() {
    return await this.wxmpService.getAdminRoutes();
  }
}
