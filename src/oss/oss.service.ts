import {
  Injectable,
  UploadedFile,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import COS = require('cos-nodejs-sdk-v5');

import { DelFileRes, DelMultipleObject, CosFileItem } from './types';
import { CosError } from 'cos-nodejs-sdk-v5';

@Injectable()
export class OssService {
  private readonly cos: COS;

  constructor(private readonly configService: ConfigService) {
    this.cos = new COS({
      SecretId: this.configService.get<string>('COSFS_SECRET_ID'),
      SecretKey: this.configService.get<string>('COSFS_SECRET_KEY'),
    });
  }

  /** 上传文件到腾讯云oss */
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

  /** 删除腾讯云oss对象 */
  async delOssObject(key: { Key: string }[]) {
    return new Promise((resolve, reject) => {
      this.cos.deleteMultipleObject(
        {
          Bucket: this.configService.get<string>('COSFS_BUCKET'),
          Region: this.configService.get<string>('COSFS_REGION'),
          Objects: key,
        },
        function (err: any, data: any) {
          if (err) {
            reject(err);
          }
          resolve(data);
        },
      );
    });
  }

  /** 检测上传对象是否在存在oss中 */
  async checkOssObject(key: string) {
    return new Promise((resolve) => {
      this.cos.headObject(
        {
          Bucket: this.configService.get<string>('COSFS_BUCKET'),
          Region: this.configService.get<string>('COSFS_REGION'),
          Key: key,
        },
        function (err, data) {
          if (data) {
            resolve(data);
          } else if (err.statusCode == 404) {
            resolve(err);
          } else if (err.statusCode == 403) {
            resolve(err);
          }
        },
      );
    });
  }

  /** 上传文件 */
  async upload(@UploadedFile() file: Express.Multer.File) {
    const { originalname, size, mimetype } = file;

    const { statusCode } = (await this.checkOssObject(
      `album/${originalname}`,
    )) as unknown as { statusCode: number };

    const COSFS_RESOURCES_URL: string = this.configService.get<string>(
      'COSFS_RESOURCES_URL',
    );
    const url: string = `${COSFS_RESOURCES_URL}${originalname}`;

    // 文件已存在 返回文件信息
    if (statusCode === 200) {
      return {
        filename: originalname,
        size,
        type: mimetype,
        date: new Date(),
        url,
      };
    }

    // 文件不存在 上传文件
    if (statusCode === 404) {
      fs.writeFileSync(`./uploads/${file.originalname}`, file.buffer);
      await this.uploadToOss(file.originalname);
      fs.unlink(`./uploads/${file.originalname}`, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('file removed');
        }
      });

      return {
        filename: originalname,
        size,
        type: mimetype,
        date: new Date(),
        url,
      };
    }

    // 权限不足 抛出异常
    if (statusCode === 403) {
      throw new HttpException('oss資源权限不足', HttpStatus.FORBIDDEN);
    }
  }

  /** 删除文件 */
  async delFile(body: DelMultipleObject[]) {
    const delKeys = body.map((item) => {
      return { Key: `album/${item.key}` };
    });

    const res = (await this.delOssObject(delKeys)) as unknown as DelFileRes;

    if ([204, 200].includes(res.statusCode)) {
      return {};
    }

    throw new HttpException('oss資源删除失败', HttpStatus.BAD_REQUEST);
  }

  /** 批量上传 */
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    const cosFiles: Array<CosFileItem> = [];

    files.forEach((file) => {
      fs.writeFileSync(`./uploads/${file.originalname}`, file.buffer);

      const cosFilesConf = {
        Bucket: this.configService.get<string>('COSFS_BUCKET'),
        Region: this.configService.get<string>('COSFS_REGION'),
        Key: `album/${file.originalname}`,
        FilePath: `./uploads/${file.originalname}`,
      };

      cosFiles.push(cosFilesConf);
    });

    this.cos
      .uploadFiles({
        files: cosFiles,
        SliceSize: 1024 * 1024 * 10, // 设置大于10MB采用分块上传
        onProgress: function (info) {
          const percent = parseInt(String(info.percent * 10000)) / 100;
          const speed =
            parseInt(String((info.speed / 1024 / 1024) * 100)) / 100;
          console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onFileFinish: function (
          err: CosError,
          data: Record<string, any>,
          options: { Key: string },
        ) {
          console.log(options.Key + '上传' + (err ? '失败' : '完成'));
        },
      })
      .then(() => {});

    const COSFS_RESOURCES_URL: string = this.configService.get<string>(
      'COSFS_RESOURCES_URL',
    );

    return files.map((file) => ({
      filename: file.originalname,
      size: file.size,
      type: file.mimetype,
      date: new Date(),
      url: `${COSFS_RESOURCES_URL}${file.originalname}`,
    }));
  }
}
