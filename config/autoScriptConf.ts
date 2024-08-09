// 掘金
const juejin = {
  url: 'https://api.juejin.cn/growth_api/v1/check_in?aid=&uuid=&spider=0&msToken=',
  sessionid: '',
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
