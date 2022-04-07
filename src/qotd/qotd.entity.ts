
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Exclusion } from 'typeorm';

@Entity({ name: 'qotd' })
export class Qotd {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  quoteId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;
}