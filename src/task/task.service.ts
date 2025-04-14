import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { juejin, bing } from '../../config/autoScriptConf';
import { shuffleArray } from '../utils';
import { EmailService } from '../email/email.service';
import { JueJinUserEntity } from './entity/juejinUser.entity';
import { NewAddJueJinUserDto } from './dto/juejin-user.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(JueJinUserEntity)
    private readonly juejinUserRepository: Repository<JueJinUserEntity>,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
  ) {}

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
    const { url, baseHeaders } = juejin;
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

    const { list } = await this.findUsers();
    const shuffled = shuffleArray(list);
    const results = [];
    await shuffled.reduce(async (prevPromise, item, index) => {
      await prevPromise;

      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }

      options.headers.cookie = `sessionid=${item.session_id}`;
      const res = await firstValueFrom(this.httpService.request(options));

      const obj = {
        name: item.nickname,
        data: {
          err_no: res.data.err_no,
          err_msg: res.data.err_msg,
          incr_point: res.data.data?.incr_point,
          sum_point: res.data.data?.sum_point,
        },
        signInTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      results.push(obj);

      await this.emailService.sendExecutionResult(
        JSON.stringify(obj, null, 2),
        {
          to: item.email,
          isError: res.data.err_no !== 0,
        },
      );

      return Promise.resolve();
    }, Promise.resolve());

    console.log('本次任务执行结果:\n', results);

    return { juejin: results };
  }

  /** @description: 获取所有可签到用户 */
  async findUsers(): Promise<{ list: JueJinUserEntity[]; total: number }> {
    const qb = this.juejinUserRepository.createQueryBuilder('juejin_users');
    qb.where('1 = 1');
    qb.where('status = 1');

    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  /** @description: 新增掘金用户 */
  async addUser(user: NewAddJueJinUserDto) {
    const { session_id } = user;
    const existUser = await this.juejinUserRepository.findOne({
      where: { session_id },
    });

    if (existUser) {
      throw new HttpException('该用户已存在', HttpStatus.CONFLICT);
    }

    const newUser = this.juejinUserRepository.create({
      ...user,
      creation_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    return await this.juejinUserRepository.save(newUser);
  }

  /** @description: 更新掘金用户 */
  async updateUser(id: string, user: NewAddJueJinUserDto) {
    const res = await this.juejinUserRepository
      .createQueryBuilder()
      .update(JueJinUserEntity)
      .set({ ...user, update_time: dayjs().format('YYYY-MM-DD HH:mm:ss') })
      .where('id = :id', { id })
      .execute();

    if (res.affected === 1) return {};

    throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
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
