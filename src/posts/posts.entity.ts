//    posts/posts.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @Column({ length: 100 })
  title: string; // 标题

  @Column({ length: 20 })
  author: string; // 作者

  @Column('text')
  content: string; // 内容

  @Column({ default: '' })
  thumb_url: string; // 缩略图

  @Column('tinyint')
  type: number; // 类型

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date; // 创建时间

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date; // 更新时间
}
