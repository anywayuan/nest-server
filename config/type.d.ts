export type JuejinAutoSignParams = {
  url: string;
  sessionids: {
    name: string;
    sessionid: string;
  }[];
};

export type BingDownloadParams = {
  base: string;
  reqUrl: string;
};
