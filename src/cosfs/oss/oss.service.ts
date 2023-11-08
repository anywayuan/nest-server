import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import COS from 'cos-nodejs-sdk-v5';
import { ConfigService } from '@nestjs/config';

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
        (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        },
      );
    });
  }
}
