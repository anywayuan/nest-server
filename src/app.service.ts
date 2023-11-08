import { Injectable, UploadedFile } from '@nestjs/common';
import * as fs from 'fs';
import { OssService } from './cosfs/oss/oss.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private ossService: OssService,
    private readonly configService: ConfigService
  ) {}

  async upload(@UploadedFile() file) {
    fs.writeFileSync(`./uploads/${file.originalname}`, file.buffer);
    const res = await this.ossService.uploadToOss(file.originalname);
    fs.unlink(`./uploads/${file.originalname}`, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('file removed');
      }
    });
    return {
      filename: file.originalname,
      size: file.size,
      type: file.mimetype,
      date: new Date(),
      url: `${this.configService.get<string>('COSFS_RESOURCES_URL')}${file.originalname}`,
    };
  }
}
