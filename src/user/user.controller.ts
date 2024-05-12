import { Controller, Get, Post, Body, Param, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

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

  @Get(":id")
  findOne(@Param("id") id: string) {
    console.log("Getting id", id);
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  updateOne(@Param("id") id: string, @Body() updateCityDto: UpdateUserDto) {
    return this.userService.updateOne(+id, updateCityDto);
  }
}
