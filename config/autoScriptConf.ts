import type { JuejinAutoSignParams, BingDownloadParams } from './type';
// 掘金
const juejin: JuejinAutoSignParams = {
  url: 'https://api.juejin.cn/growth_api/v1/check_in?aid=&uuid=&spider=0&msToken=',
  baseHeaders: {
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

// 必应
const bing: BingDownloadParams = {
  base: 'https://www.bing.com',
  reqUrl:
    'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=9&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160&setmkt=%s&setlang=en',
};

export { juejin, bing };
