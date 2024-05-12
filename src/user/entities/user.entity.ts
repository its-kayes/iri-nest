import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  userName: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "text" })
  country: string;

  @Column({ type: "text" })
  profession: string;
}
