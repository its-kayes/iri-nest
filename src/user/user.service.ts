import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashText } from "src/util/hashText";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createCheckDto: CreateUserDto) {
    createCheckDto.password = await hashText(createCheckDto.password);

    const result = this.userRepository.create(createCheckDto);

    return await this.userRepository.save(result);
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
