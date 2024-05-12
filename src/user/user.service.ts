import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashText } from "src/util/hashText";
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
        select: ["id", "userName", "email"],
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
}
