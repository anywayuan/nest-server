import { Injectable, UploadedFile } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  upload(@UploadedFile() file): string {
    console.log(file);
    fs.writeFileSync(`./${file.originalname}`, file.buffer);
    // TODO: save file to oss bucket
    fs.unlink(`./${file.originalname}`, (err) => {
      if (err) {
        console.error(err);
      } else {
        //file removed
        console.log('file removed');
      }
    });
    return 'Hello World!';
  }
}
