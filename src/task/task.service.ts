import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import { juejin, bing } from '../../config/autoScriptConf';
import * as dayjs from 'dayjs';
import { shuffleArray } from '../utils';

@Injectable()
export class ScheduleService {
  constructor(private readonly httpService: HttpService) {}

  @Cron('0 0 6 * * *')
  async handleCron() {
    const bingRes = await this.AutoDownloadBingWallpaperByEveryDay();

    const maxDelay = 3 * 60 * 60 * 1000;
    const randomDelay = Math.floor(Math.random() * maxDelay);

    console.log(
      '预计开始执行任务时间: ',
      dayjs().add(randomDelay, 'ms').format('YYYY-MM-DD HH:mm:ss'),
    );

    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    console.log('开始执行任务: ', dayjs().format('YYYY-MM-DD HH:mm:ss'));

    const jjRes = await this.AutoSignToJJ();

    return Object.assign({}, jjRes, bingRes);
  }

  /** @description: 掘金自动签到 */
  async AutoSignToJJ() {
    const { sessionids, url, baseHeaders } = juejin;
    const options = {
      url,
      method: 'post',
      headers: {
        cookie: '',
        Origin: 'https://juejin.cn',
        Referer: 'https://juejin.cn/',
        ...baseHeaders,
      },
    };

    const shuffled = shuffleArray(sessionids);
    const results = [];
    await shuffled.reduce(async (prevPromise, item, index) => {
      await prevPromise;
      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
      options.headers.cookie = `sessionid=${item.sessionid}`;
      const res = await firstValueFrom(this.httpService.request(options));
      results.push({
        name: item.name,
        data: {
          err_no: res.data.err_no,
          err_msg: res.data.err_msg,
          incr_point: res.data.data?.incr_point,
          sum_point: res.data.data?.sum_point,
        },
        signInTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      return Promise.resolve();
    }, Promise.resolve());

    console.log('本次任务执行结果: ', results);

    return {
      juejin: results,
    };
  }

  /** @description: 必应壁纸每日下载 */
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

    return {
      bing: response.statusText,
    };
  }
}
