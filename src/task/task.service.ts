import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';

@Injectable()
export class ScheduleService {
  constructor(private readonly httpService: HttpService) {}

  @Cron('30 10 0 * * *')
  handleCron() {
    this.AutoSignToJJ();
    this.AutoSignToZM();
    this.AutoDownloadBingWallpaperByEveryDay().then(() => {});
  }

  /**
   * @description: 掘金自动签到
   */
  AutoSignToJJ() {
    const sessionid: string = 'aeb81595b2bde6369235bdb4ec7360e2'; // SessionID
    const url: string =
      'https://api.juejin.cn/growth_api/v1/check_in?aid=2608&uuid=7170885490388043297&spider=0&msToken=IIknwbAVAiSVpKHIwKVtsx1Kd8vx7M6BRaCkrq7Ymk2WYGdNy2K6TzHXdjsKbiihCmElL9dv7romSX-G18nljUIzYG1YLkDnij42PTuiE8in8X1gYDSkV1nlSt8dUZ95&a_bogus=my0mXchtMsm1cfVwJwDz9bwm8qD0YWRVgZEzBetwIzLD';
    const options = {
      url,
      method: 'post',
      headers: {
        cookie: 'sessionid=' + sessionid,
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
    const cookie: string =
      'wordpress_sec_9f31b74abcbd1c3b130564da32286f2f=anywayuan%7C1703742560%7CHRVYfAYo7pjfeJNE2U4o8L577Ukl4HFPGutKra7SScp%7C0dd4b66efc43b7b14e43b0f81b8a73cc11bbaf3187033e1b0df8881f1e714f9b; __51vcke__JIXrSMd2TfFevxLS=86ef1a72-c064-57d8-a899-26fff5a1a5c7; __51vuft__JIXrSMd2TfFevxLS=1698986406367; __51huid__K2QVQraVo2bvLB8o=f7e99f01-e464-5b5c-b378-657d8f0d9fff; __51uvsct__JIXrSMd2TfFevxLS=13; PHPSESSID=ohodv75e27c2sk2d3m3bao6i91; Hm_lvt_0acbdfffd7e74560a42f779e64063225=1700537710,1701398878,1702258735,1702532953; wordpress_logged_in_9f31b74abcbd1c3b130564da32286f2f=anywayuan%7C1703742560%7CHRVYfAYo7pjfeJNE2U4o8L577Ukl4HFPGutKra7SScp%7C9f4222ae4e58816b0602b5cc77a8161ed2c6f7c804957a66ae01ab9dea5fa377; Hm_lpvt_0acbdfffd7e74560a42f779e64063225=1702533091'; // Cookie
    const url: string = 'https://www.zuanmang.net/wp-admin/admin-ajax.php'; // 签到接口
    const action: string = 'user_checkin'; // 行为 user_checkin代表签到 钻芒接口固定值

    const formData = new FormData();
    formData.append('action', action);

    const options = {
      url: url,
      method: 'post',
      headers: {
        cookie: cookie,
      },
      data: formData,
    };

    firstValueFrom(this.httpService.request(options)).then((res) => {
      console.log('钻芒自动签：', res.data);
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

    const base: string = 'https://www.bing.com';
    const reqUrl: string =
      base +
      '/HPImageArchive.aspx?format=js&idx=0&n=9&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160&setmkt=%s&setlang=en';
    const options = {
      url: reqUrl,
      method: 'get',
    };
    let todayWallpaper = {} as TodayWallpaper;
    const res = await firstValueFrom(this.httpService.request(options));
    todayWallpaper = res.data.images[0] as TodayWallpaper;
    const imageFullUrl: string = base + todayWallpaper.url; // 图片资源路径
    // 下载资源
    const response = await firstValueFrom(
      this.httpService.request({
        url: imageFullUrl,
        method: 'get',
        responseType: 'arraybuffer',
      }),
    );
    // 保存图片
    fs.writeFileSync(
      `./bing/${todayWallpaper.enddate}.jpeg`,
      Buffer.from(response.data),
    );
  }
}
