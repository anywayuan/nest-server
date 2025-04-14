import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('juejin_users')
export class JueJinUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  session_id: string;

  @Column()
  email: string;

  @Column({ default: 1 })
  status: number;

  @Column({
    name: 'creation_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  creation_time: Date;

  @Column({
    name: 'update_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  update_time: Date;
}
