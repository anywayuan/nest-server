import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  // OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  // Index,
  Unique,
  JoinColumn,
} from 'typeorm';
// import { SysRoutePermission } from './sys_route_permission.entity'; // 关联实体

@Entity('sys_route')
@Tree('materialized-path') // 使用物化路径实现树结构
@Unique(['path']) // 路径唯一约束
@Unique(['name']) // 名称唯一约束
export class SysRoute {
  @PrimaryGeneratedColumn({ unsigned: true, comment: '路由ID' })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '路由路径 (e.g. /system/user)',
  })
  path: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '路由名称 (前端组件名)',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '路由标题 (显示在面包屑/标签页)',
  })
  title: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '菜单图标 (e.g. el-icon-menu)',
  })
  icon: string | null;

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否隐藏菜单 (true=隐藏)',
  })
  hidden: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'always_show',
    comment: '是否始终显示根菜单',
  })
  alwaysShow: boolean;

  @TreeChildren({ cascade: true }) // 级联操作子路由
  children: SysRoute[];

  @TreeParent({ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' }) // 明确指定数据库列名
  parent: SysRoute | null;

  // 添加这个字段解决 parentId 问题
  @Column({ name: 'parent_id', nullable: true, unsigned: true, select: false })
  parentId: number | null;

  @Column({
    type: 'int',
    default: 0,
    comment: '同级排序号',
  })
  rank: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 255, default: '' })
  mpath: string;

  // 关联权限表 (一对多)
  // @OneToMany(() => SysRoutePermission, (permission) => permission.route, {
  //   cascade: true,
  // })
  // permissions: SysRoutePermission[];
}
