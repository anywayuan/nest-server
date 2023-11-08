import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './global/decorator/public.decorator';

@ApiTags('Universal')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return this.appService.upload(file);
  }
}
