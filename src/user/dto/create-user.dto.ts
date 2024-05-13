import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "Emrul Kayes", description: "The name of the user" })
  @IsString()
  userName: string;

  @ApiProperty({
    example: "kayes@email.com",
    description: "The email of the user",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "secret", description: "The password of the user" })
  @IsString()
  password: string;

  @ApiProperty({
    example: "bangladesh",
    description: "The country of the user",
  })
  @IsString()
  country: string;

  @ApiProperty({ example: "dev", description: "The profession of the user" })
  @IsString()
  profession: string;
}
