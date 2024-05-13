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
import { JwtService } from "@nestjs/jwt";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const result = this.userService.create(createUserDto);
    return result;
  }

  @Get()
  async findAll() {
    const result = await this.userService.findAll();
    return result;
  }

  @Get("login")
  async login(@Query() userInfo: LoginUserDto) {
    const result = await this.userService.login(userInfo);

    if (!result.isLogin) {
      return result;
    } else {
      const payload = {
        msg: result.message,
        inLogin: result.isLogin,
        userInfo: result.findInfo,
      };

      return {
        message: result.message,
        inLogin: result.isLogin,
        userInfo: result.findInfo,
        access_token: await this.jwtService.signAsync(payload),
      };
    }
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
