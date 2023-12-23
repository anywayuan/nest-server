import { Injectable, UploadedFile } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import COS = require('cos-nodejs-sdk-v5');

@Injectable()
export class OssService {
  private readonly cos: COS;

  constructor(private readonly configService: ConfigService) {
    this.cos = new COS({
      SecretId: this.configService.get<string>('COSFS_SECRET_ID'),
      SecretKey: this.configService.get<string>('COSFS_SECRET_KEY'),
    });
  }

  async uploadToOss(Key: string) {
    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: this.configService.get<string>('COSFS_BUCKET'),
          Region: this.configService.get<string>('COSFS_REGION'),
          Key: `album/${Key}`,
          Body: fs.createReadStream(`./uploads/${Key}`),
        },
        (err: any, data: unknown) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        },
      );
    });
  }

  async upload(@UploadedFile() file: Express.Multer.File) {
    fs.writeFileSync(`./uploads/${file.originalname}`, file.buffer);
    await this.uploadToOss(file.originalname);
    fs.unlink(`./uploads/${file.originalname}`, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('file removed');
      }
    });

    const COSFS_RESOURCES_URL: string = this.configService.get<string>(
      'COSFS_RESOURCES_URL',
    );
    const { originalname, size, mimetype } = file;
    const url: string = `${COSFS_RESOURCES_URL}${originalname}`;

    console.log(file);
    return {
      filename: originalname,
      size,
      type: mimetype,
      date: new Date(),
      url,
    };
  }
}
