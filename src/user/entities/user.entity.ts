import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "kayes", description: "Name of the user" })
  @Column({ type: "text" })
  userName: string;

  @ApiProperty({
    example: "kayes@gmail.com",
    description: "Email address of the user.",
  })
  @Column({ type: "text" })
  email: string;

  @ApiProperty({ example: "1234", description: "Password of the user." })
  @Column({ type: "text" })
  password: string;

  @ApiProperty({
    example: "bangladesh",
    description: "Name of the country here user live",
  })
  @Column({ type: "text" })
  country: string;

  @ApiProperty({ example: "profession", description: "About user profession" })
  @Column({ type: "text" })
  profession: string;
}
