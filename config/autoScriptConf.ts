import type { JuejinAutoSignParams } from './type';
// 掘金
const juejin: JuejinAutoSignParams = {
  url: 'https://api.juejin.cn/growth_api/v1/check_in?aid=&uuid=&spider=0&msToken=',
  sessionids: [
    {
      name: 'liang',
      sessionid: '7dd5e3dcf708b7b88c382af9b12573cd',
    },
    {
      name: 'qiang',
      sessionid: '21883a4db9073ac9c0381803c8ebfffe',
    },
    {
      name: 'long',
      sessionid: 'd979b9cc3425cf4b0dba3c664b9fd0a6',
    },
    {
      name: 'xing',
      sessionid: 'c1c9e12724c755785be3aaa53a5a9cb3',
    },
    {
      name: 'xi',
      sessionid: '7c727a6a27f435dfd049f6468abd7963',
    },
  ],
};

// 钻芒
const zm = {
  cookie: '',
  url: 'https://www.zuanmang.net/wp-admin/admin-ajax.php',
  action: 'user_checkin',
};

// 必应
const bing = {
  base: 'https://www.bing.com',
  reqUrl:
    'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=9&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160&setmkt=%s&setlang=en',
};

export { juejin, zm, bing };
