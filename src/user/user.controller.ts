import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const result = this.userService.create(createUserDto);
    return result;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get("login") // Matches GET requests to /user/login
  login(@Query() userInfo: LoginUserDto) {
    return this.userService.login(userInfo);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    console.log("Getting id", id);
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  updateOne(@Param("id") id: string, @Body() updateCityDto: UpdateUserDto) {
    return this.userService.updateOne(+id, updateCityDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
