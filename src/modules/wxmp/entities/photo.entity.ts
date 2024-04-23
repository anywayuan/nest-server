import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('photos')
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pid: number;

  @Column()
  url: string;

  @Column()
  create_time: Date;

  @Column()
  key: string;

  @Column()
  update_time: Date;
}
