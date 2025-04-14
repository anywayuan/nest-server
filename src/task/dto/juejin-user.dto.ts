import { IsNotEmpty, IsNumber } from 'class-validator';

export class NewAddJueJinUserDto {
  @IsNotEmpty({ message: 'nickname is required' })
  readonly nickname: string;

  @IsNotEmpty({ message: "'session_id' is required" })
  readonly session_id: string;

  @IsNotEmpty({ message: "'email' is required" })
  readonly email: string;

  @IsNotEmpty({ message: "'status' is required" })
  @IsNumber({}, { message: "'status' must be number type" })
  readonly status: number;Ï
}
