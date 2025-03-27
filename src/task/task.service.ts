import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import { juejin, zm, bing } from '../../config/autoScriptConf';
import * as dayjs from 'dayjs';
import { shuffleArray } from '../utils';

@Injectable()
export class ScheduleService {
  constructor(private readonly httpService: HttpService) {}

  @Cron('0 0 6 * * *')
  async handleCron() {
    const maxDelay = 3 * 60 * 60 * 1000;
    const randomDelay = Math.floor(Math.random() * maxDelay);
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    const jjRes = await this.AutoSignToJJ();
    const bingRes = await this.AutoDownloadBingWallpaperByEveryDay();
    return Object.assign({}, jjRes, bingRes);
  }

  /**
   * @description: 掘金自动签到
   */
  async AutoSignToJJ() {
    const { sessionids, url } = juejin;
    const options = {
      url,
      method: 'post',
      headers: {
        cookie: '',
        Origin: 'https://juejin.cn',
        Referer: 'https://juejin.cn/',
        'sec-ch-ua':
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
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
        data: res.data,
        signInTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      return Promise.resolve();
    }, Promise.resolve());

    console.log(
      '本次掘金签到结果: ',
      dayjs().format('YYYY-MM-DD HH:mm:ss'),
      results,
    );

    return {
      juejin: results,
    };
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

    return {
      bing: response.statusText,
    };
  }
}
