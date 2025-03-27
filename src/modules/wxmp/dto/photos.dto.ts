import { IsNotEmpty } from 'class-validator';
export class AddPhoto {
  @IsNotEmpty({ message: 'pid is required' })
  readonly pid: number;

  @IsNotEmpty({ message: 'url is required' })
  readonly url: string;

  @IsNotEmpty({ message: 'key is required' })
  readonly key: string;
}

export class DelPhoto {
  @IsNotEmpty({ message: 'id is required' })
  readonly id: number;

  @IsNotEmpty({ message: 'key is required' })
  readonly key: string;
}
