import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OssService } from './oss.service';
import { Public } from '../global/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadResDto } from '../base/dto/upload.dto';
import { DelMultipleObject } from './types';

@ApiTags('oss')
@Controller()
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传文件' })
  @ApiResponse({ status: 200, description: 'success', type: UploadResDto })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.ossService.upload(file);
  }

  /** TODO: oss删除测试 */
  @Delete('oss/del')
  delFile(@Body() body: DelMultipleObject[]) {
    return this.ossService.delFile(body);
  }
}
