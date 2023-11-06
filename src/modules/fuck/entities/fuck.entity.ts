import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fuck')
export class FuckEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({
    name: 'creation_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationTime: Date;
}
