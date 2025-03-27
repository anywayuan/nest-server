// https://cloud.tencent.com/document/product/436/64983

type DelSucItem = {
  Key: string;
  VersionId: string;
  DeleteMarker: string;
  DeleteMarkerVersionId: string;
};

type DelErrItem = {
  Key: string;
  Code: string;
  Message: string;
};

export type DelFileRes = {
  Deleted: DelSucItem[];
  Error: DelErrItem[];
  statusCode: number;
  headers: {
    'content-type': string;
    'content-length': string;
    connection: string;
    date: string;
    server: string;
    'x-cos-request-id': string;
  };
  RequestId: string;
};

export type DelMultipleObject = {
  key: string; // 对象键（Object 的名称），对象在存储桶中的唯一标识
  VersionId?: string; // 要删除的对象版本 ID 或 DeleteMarker 版本 ID
  id?: number; // 记录id
};

export type CosFileItem = {
  Bucket: string;
  Region: string;
  Key: string;
  FilePath: string;
};
