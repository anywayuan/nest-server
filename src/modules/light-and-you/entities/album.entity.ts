import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('albums')
export class AlbumsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  zh_title: string;

  @Column()
  cover_url: string;

  @Column()
  del: number;

  @Column()
  create_time: Date;

  @Column()
  update_time: Date;
}
