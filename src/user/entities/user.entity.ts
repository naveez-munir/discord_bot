import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
@Entity('users')
export class User {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  status: string | null;

  @Column({ type: 'varchar', unique: true })
  emp_no: string;

  @Column({ type: 'date' })
  joining_date: Date;

  @Column({ type: 'varchar', length: 20 })
  contact_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
