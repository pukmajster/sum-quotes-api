
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  firstName: string;

  @Column({ type: "varchar" })
  lastName: string;

  @Column({ type: "varchar", unique: true})
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "text" })
  quote: string;

  // Caclulated every time a user either upvotes or downvotes a quote
  // = sum of upvotes - sum of downvotes
  //
  // A user can only either upvote or downvote a quote, not both
  @Column({ type: "int", default: 0 })
  score: number;

  // TODO: downvotes and upvotes...
  // Maybe both as lists of user IDs?
  // Could turn out to be much easer to maintain
  // Yes, this doesn't keep track of edit and creation times, but such is life
  
  // I'm trying real hard to acomplish all this with just one entity 
  @Column('int', { array: true, default: [] })
  upvotes: number[];

  @Column('int', { array: true, default: [] })
  downvotes: number[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;
}