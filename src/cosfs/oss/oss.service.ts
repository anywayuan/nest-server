import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
// import COS from 'cos-nodejs-sdk-v5'; // 腾讯 cos 使用 import 会报错，不支持 es6 模块

// eslint-disable-next-line @typescript-eslint/no-var-requires
const COS = require('cos-nodejs-sdk-v5');

@Injectable()
export class OssService {
  private readonly cos;

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
}
