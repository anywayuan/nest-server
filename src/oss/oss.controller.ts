import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { OssService } from './oss.service';
import { Public } from '../global/decorator/public.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DelMultipleObject } from './types';

@ApiTags('oss')
@Controller()
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.ossService.upload(file);
  }

  /** 批量上传 */
  @Post('batchUpload')
  @Public()
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.ossService.uploadFiles(files);
  }

  /** TODO: oss删除测试 */
  @Delete('oss/del')
  delFile(@Body() body: DelMultipleObject[]) {
    return this.ossService.delFile(body);
  }
}
