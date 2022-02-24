
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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

  // TODO: downvotes and upvotes...
  // Maybe both as lists of user IDs?
  // Could turn out to be much easer to maintain
}