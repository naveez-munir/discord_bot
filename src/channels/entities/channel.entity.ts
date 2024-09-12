import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Workspace } from '../../workspace/entities/workspace.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('channels')
export class Channel extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @ManyToOne(() => Workspace) // TODO add cascading
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @ManyToOne(() => User) // TODO add cascading
  @JoinColumn({ name: 'primary_member_id' })
  primary_member: User;
}
