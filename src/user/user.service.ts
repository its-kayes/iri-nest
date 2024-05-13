import * as bcrypt from "bcrypt";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashText } from "../util/hashText";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createCheckDto: CreateUserDto) {
    createCheckDto.password = await hashText(createCheckDto.password);

    const user = this.userRepository.create(createCheckDto);

    return await this.userRepository.save(user);
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        select: ["id", "userName", "email", "profession", "country"],
        order: { id: "DESC" },
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const { password, ...rest } = await this.userRepository.findOne({
        where: { id },
      });

      return rest;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const userInfo = await this.findOne(id);
    console.log("userInfo", userInfo);
    if (!userInfo) {
      throw new NotFoundException();
    }

    Object.assign(userInfo, updateUserDto);

    const { password, ...rest } = await this.userRepository.save(userInfo);

    return rest;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    return await this.userRepository.delete(id);
  }

  async login(userInfo: { email: string; password: string }) {
    const findInfo = await this.userRepository.findOne({
      where: { email: userInfo.email },
    });

    const isMatch = await bcrypt.compare(userInfo.password, findInfo.password);

    if (!isMatch) {
      return { message: "Password not matched", isLogin: false };
    } else {
      true;
      return {
        message: "Password  matched",
        isLogin: true,
        findInfo: {
          id: findInfo.id,
          userName: findInfo.userName,
          email: findInfo.email,
          country: findInfo.country,
          profession: findInfo.profession,
        },
      };
    }
  }
}
