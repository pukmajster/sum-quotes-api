
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  // TODO: downvotes and upvotes...
  // Maybe both as lists of user IDs?
  // Could turn out to be much easer to maintain

  // Caclulated every time a user either upvotes or downvotes a quote
  // = sum of upvotes - sum of downvotes
  //
  // A user can only either upvote or downvote a quote, not both
  @Column({ type: "int" })
  score: number;
}