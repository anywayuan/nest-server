// 掘金
const juejin = {
  url: 'https://api.juejin.cn/growth_api/v1/check_in?aid=2608&uuid=7170885490388043297&spider=0&msToken=o5G-bcrQ4PEhh5wmC34NqK58RJU8Qx4BmbZ8a_zU5GUcoh2qCfd3suGlYSStVGT8ItUt_iqYiSjANr6VZl8ZFhVk9QvzMo2N4xXqF6RD-JlMv-eXD3cUGblwYTNdNSchyw%3D%3D&a_bogus=Q6Uxgc2tMsm1F73BGwDz9r8Eikb0YWRAgZEPatSB-tLr',
  sessionid: '3cefdb4753588ab0611f98ab987acb15',
};

// 钻芒
const zm = {
  cookie:
    'wordpress_sec_9f31b74abcbd1c3b130564da32286f2f=anywayuan%7C1704505080%7C0jfvSffaabxpvVGoeNmXtQXzRS3ZuaqwIVC7IuZsWYS%7Cbfa1f489d5a085830971084598e0bbae5b2ac725923318f6023a0da70a1d7c85; __51vcke__JIXrSMd2TfFevxLS=86ef1a72-c064-57d8-a899-26fff5a1a5c7; __51vuft__JIXrSMd2TfFevxLS=1698986406367; __51huid__K2QVQraVo2bvLB8o=f7e99f01-e464-5b5c-b378-657d8f0d9fff; wordpress_logged_in_9f31b74abcbd1c3b130564da32286f2f=anywayuan%7C1704505080%7C0jfvSffaabxpvVGoeNmXtQXzRS3ZuaqwIVC7IuZsWYS%7C5369827220030b9c94ca7552e5c384e70ab80e1de823e7023c98cf73cc34b791; PHPSESSID=tru2frj1fn5fdgv9u9401dh4ai; Hm_lvt_0acbdfffd7e74560a42f779e64063225=1702532953,1703229029,1703295411,1703727907; __51uvsct__JIXrSMd2TfFevxLS=20; __vtins__JIXrSMd2TfFevxLS=%7B%22sid%22%3A%20%22ac5972df-cde6-5e00-a55f-3bbd37f2e625%22%2C%20%22vd%22%3A%202%2C%20%22stt%22%3A%205096%2C%20%22dr%22%3A%205096%2C%20%22expires%22%3A%201703750763042%2C%20%22ct%22%3A%201703748963042%7D; Hm_lpvt_0acbdfffd7e74560a42f779e64063225=1703748963',
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
