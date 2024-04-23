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
import { GetPhotosResDto, GetPhotosReqDto } from './dto/get-photos.dto';
import { AlbumDto, CreateAlbumsResDto } from './dto/album.dto';
import { AddPhoto, DelPhoto } from './dto/photos.dto';
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
  async updateAlbum(@Param('id') id: string, @Body() body: Partial<AlbumDto>) {
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

  @Get('photos')
  @ApiOperation({ summary: '根据分类获取' })
  @ApiResponse({ status: 200, description: 'success', type: GetPhotosResDto })
  async getPhotosByAlbum(@Body() body: GetPhotosReqDto) {
    return await this.wxmpService.getPhotosByAlbum(body);
  }

  /** 管理分类下图片-新增 */
  @Post('photos')
  async addPhoto(@Body() body: AddPhoto) {
    return this.wxmpService.addPhoto(body);
  }

  /** 管理分类下图片-删除 */
  /**
   * 1. 根据id删除记录
   * 2. 根据当前id查询到旧key调用oss删除模块删除原图片
   */
  @Delete('photos')
  async delPhoto(@Body() body: DelPhoto[]) {
    return this.wxmpService.delPhoto(body);
  }

  /** 管理分类下图片-编辑 */
  /**   编辑时如果图片地址有变化:
   * 1. 前端需要将新的key（文件名称）传回来。
   * 2. 根据当前id查询到旧key调用oss删除模块删除原图片。
   */
  @Put('photos/:id')
  async updatePhoto(@Param() id: string, @Body() body: Partial<AddPhoto>) {
    return {
      ...body,
      id,
    };
  }

  @Get('admin/routes')
  async getAdminRoutes() {
    return await this.wxmpService.getAdminRoutes();
  }
}
