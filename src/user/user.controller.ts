import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  Inject,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER, CacheKey, CacheTTL } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@ApiBearerAuth()
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @ApiOperation({ summary: "Create User" })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const result = this.userService.create(createUserDto);
    return result;
  }

  @ApiOperation({ summary: "Get All" })
  @CacheKey("get_all_user")
  @CacheTTL(5)
  @Get()
  async findAll() {
    const result = await this.userService.findAll();
    return result;
  }

  @ApiOperation({ summary: "User Login" })
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

      const access_token = await this.jwtService.signAsync(payload);
      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: "10d",
      });

      await this.cacheManager.set(
        `access_token_${result.findInfo.id}`,
        access_token
      );

      await this.cacheManager.set(
        `refresh_token_${result.findInfo.id}`,
        refresh_token
      );

      return {
        message: result.message,
        inLogin: result.isLogin,
        userInfo: result.findInfo,
        access_token,
      };
    }
  }

  @ApiOperation({ summary: "Get Single User" })
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const isExitOnRedis = await this.cacheManager.get(`userId-${id}`);

    if (isExitOnRedis) {
      return isExitOnRedis;
    } else {
      const userInfo = await this.userService.findOne(+id);

      await this.cacheManager.set(`userId-${id}`, userInfo);

      return userInfo;
    }
  }

  @ApiOperation({ summary: "Update Single User" })
  @Patch(":id")
  updateOne(@Param("id") id: string, @Body() updateCityDto: UpdateUserDto) {
    return this.userService.updateOne(+id, updateCityDto);
  }

  @ApiOperation({ summary: "Delete User" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }

  @ApiOperation({ summary: "Get refresh token from cache (redis)" })
  @Get("refresh-token/:id")
  async refreshToken(@Param("id") id: string) {
    const token = await this.cacheManager.get(`refresh_token_${id}`);
    return { refreshToken: token };
  }
}
