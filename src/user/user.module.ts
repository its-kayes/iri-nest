import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./user.constance";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";
// import * as redisStore from "cache-manager-redis-store";
import { redisStore } from "cache-manager-redis-store";
import type { RedisClientOptions } from "redis";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60s" },
    }),
    CacheModule.register({
      // @ts-ignore
      store: async () =>
        await redisStore({
          // Store-specific configuration:
          socket: {
            host: "localhost",
            port: 6379,
          },
        }),
    }),
    // CacheModule.register<RedisClientOptions>({
    //   store: redisStore,
    //   host: "localhost",
    //   port: 6379,
    //   // ttl: 1000, // seconds
    //   // max: 10, // maximum number of items in cache
    //   // isGlobal: true,
    // }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class UserModule {}
