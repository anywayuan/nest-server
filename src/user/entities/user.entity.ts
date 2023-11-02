import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  username: string; // 用户名

  @Column({ length: 100 })
  nickname: string; // 昵称

  @Exclude() // 排除密码字段
  @Column()
  password: string; // 密码

  @Column()
  avatar: string; // 头像

  @Column()
  sex: number; // 性别 0:女 1:男

  @Column()
  email: string; // 邮箱

  @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
  role: string; // 用户角色

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  // 用户状态 0:禁用 1:启用 2:删除 默认启用
  @Column({ default: 1 })
  status: number;

  // 密码加密
  @BeforeInsert()
  async encryptPwd() {
    this.password = bcrypt.hashSync(this.password);
  }
}
