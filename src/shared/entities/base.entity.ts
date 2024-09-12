import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeormBaseEntity,
} from 'typeorm';

export abstract class BaseEntity extends TypeormBaseEntity {
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
