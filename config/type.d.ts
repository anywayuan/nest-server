export type JuejinAutoSignParams = {
  url: string;
  baseHeaders?: Record<string, string>;
  sessionids: {
    name: string;
    sessionid: string;
  }[];
};

export type BingDownloadParams = {
  base: string;
  reqUrl: string;
};
