import { Injectable, UploadedFile } from '@nestjs/common';
import * as fs from 'fs';
import { OssService } from './cosfs/oss/oss.service';

@Injectable()
export class AppService {
  constructor(private ossService: OssService) {}

  async upload(@UploadedFile() file): Promise<string> {
    fs.writeFileSync(`./${file.originalname}`, file.buffer);
    const res = await this.ossService.uploadToOss(file.originalname);
    console.log(res);
    fs.unlink(`./uploads/${file.originalname}`, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('file removed');
      }
    });
    return 'Hello World!';
  }
}
