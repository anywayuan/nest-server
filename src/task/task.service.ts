import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import { juejin, zm, bing } from '../../config/autoScriptConf';
import * as dayjs from 'dayjs';

@Injectable()
export class ScheduleService {
  constructor(private readonly httpService: HttpService) {}

  @Cron('30 10 0 * * *')
  async handleCron() {
    console.log('定时任务-开始');
    this.AutoSignToJJ();
    // this.AutoSignToZM();
    await this.AutoDownloadBingWallpaperByEveryDay();
    console.log('定时任务-结束');
  }

  /**
   * @description: 掘金自动签到
   */
  AutoSignToJJ() {
    const options = {
      url: juejin.url,
      method: 'post',
      headers: {
        cookie: 'sessionid=' + juejin.sessionid,
      },
    };
    firstValueFrom(this.httpService.request(options)).then((res) => {
      console.log('掘金自动：', res.data);
    });
  }

  /**
   * @description: 钻芒自动签到
   */
  AutoSignToZM() {
    const formData = new FormData();
    formData.append('action', zm.action);

    const options = {
      url: zm.url,
      method: 'post',
      headers: {
        cookie: zm.cookie,
      },
      data: formData,
    };

    firstValueFrom(this.httpService.request(options)).then((res) => {
      console.log('钻芒自动签到：', res.data);
    });
  }

  /**
   * @description: 必应壁纸每日下载
   */
  async AutoDownloadBingWallpaperByEveryDay() {
    type TodayWallpaper = {
      url: string;
      title: string;
      copyright: string;
      enddate: string;
    };

    const options = {
      url: bing.reqUrl,
      method: 'get',
    };
    let todayWallpaper = {} as TodayWallpaper;
    const res = await firstValueFrom(this.httpService.request(options));
    todayWallpaper = res.data.images[0] as TodayWallpaper;
    const imageFullUrl: string = bing.base + todayWallpaper.url; // 图片资源路径
    // 下载资源
    const response = await firstValueFrom(
      this.httpService.request({
        url: imageFullUrl,
        method: 'get',
        responseType: 'arraybuffer',
      }),
    );
    const currentYear = dayjs().format('YYYY');
    const currentMonth = dayjs().format('MM');
    const folderName = `${currentYear + currentMonth}`;
    // 创建文件夹
    if (!fs.existsSync(`./bing/${folderName}`)) {
      fs.mkdirSync(`./bing/${folderName}`);
    }
    const fileName =
      todayWallpaper.title && todayWallpaper.title !== 'Info'
        ? todayWallpaper.title
        : todayWallpaper.enddate;

    // 保存图片
    fs.writeFileSync(
      `./bing/${folderName}/${fileName}.jpeg`,
      Buffer.from(response.data),
    );
  }
}
