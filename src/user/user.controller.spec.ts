import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { DeleteResult, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const jwtOptions: JwtModuleOptions = {
      secret: "b437f9acc3975496ec2324d92f8f58f0f8d8ea0c",
      signOptions: { expiresIn: "1h" },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
      imports: [
        JwtModule.registerAsync({
          useFactory: () => jwtOptions,
        }),
        CacheModule.register(),
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it("is be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("is create a new user", async () => {
      const createUserDto: CreateUserDto = {
        userName: "user",
        email: "user@example.com",
        password: "password",
        country: "USA",
        profession: "Developer",
      };

      const createdUser: User = {
        id: 1,
        userName: "user",
        email: "user@example.com",
        password: "password",
        country: "USA",
        profession: "Developer",
      };

      jest.spyOn(service, "create").mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(createdUser);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe("findAll", () => {
    it("is return an array of users", async () => {
      const users = [
        {
          id: 1,
          userName: "Use",
          email: "user@example.com",
          password: "password",
          country: "bd",
          profession: "dev",
        },
        {
          id: 2,
          userName: "user2",
          email: "user2@example.com",
          password: "password2",
          country: "bd2",
          profession: "dev2",
        },
      ];
      jest.spyOn(service, "findAll").mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(users);
    });
  });

  describe("findOne", () => {
    it("is return a user's info", async () => {
      const userId = "1";
      const userInfo = {
        id: 1,
        userName: "user2",
        email: "user2@example.com",
        country: "bd",
        profession: "dev",
      };

      jest.spyOn(service, "findOne").mockResolvedValue(userInfo);

      const result = await controller.findOne(userId);

      expect(result).toEqual(userInfo);
    });
  });

  describe("updateOne", () => {
    it("is update a user with given ID and data", async () => {
      const userId = "1";
      const updateData: UpdateUserDto = {
        userName: "user3",
        email: "user2@example.com",
        country: "ind",
        profession: "team lead",
      };

      const updatedUser = {
        id: 1,
        userName: "user3",
        email: "user2@example.com",
        country: "ind",
        profession: "team lead",
      };
      jest.spyOn(service, "updateOne").mockResolvedValue(updatedUser);

      const result = await controller.updateOne(userId, updateData);

      expect(service.updateOne).toHaveBeenCalledWith(+userId, updateData);

      expect(result).toEqual(updatedUser);
    });
  });

  describe("remove", () => {
    it("is remove a user by ID", async () => {
      const userId = "1";

      const deleteResult: DeleteResult = {
        affected: 1,
        raw: undefined,
      };
      jest.spyOn(service, "remove").mockResolvedValue(deleteResult);

      const result = await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledWith(+userId);

      expect(result).toEqual(deleteResult);
    });
  });
});
