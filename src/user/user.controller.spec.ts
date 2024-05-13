import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { DeleteResult, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import { UpdateUserDto } from "./dto/update-user.dto";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const jwtOptions: JwtModuleOptions = {
      secret: "your-secret-key", // Replace with your JWT secret
      signOptions: { expiresIn: "1h" }, // Example: token expiration time
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
        CacheModule.register(), // Include CacheModule if used in UserService
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = [
        {
          id: 1,
          userName: "John",
          email: "john@example.com",
          password: "password",
          country: "bd",
          profession: "dev",
        },
        {
          id: 2,
          userName: "Alice",
          email: "alice@example.com",
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
    it("should return a user's info", async () => {
      const userId = "1"; // Set the ID for the user you want to find
      const userInfo = {
        id: 1,
        userName: "John",
        email: "john@example.com",
        country: "bd",
        profession: "dev",
      };

      jest.spyOn(service, "findOne").mockResolvedValue(userInfo);

      // Call controller.findOne with the specified userId
      const result = await controller.findOne(userId);

      // Verify that the returned result matches the expected user info
      expect(result).toEqual(userInfo);
    });
  });

  describe("updateOne", () => {
    it("should update a user with given ID and data", async () => {
      // Mock data
      const userId = "1"; // ID of the user to update
      const updateData: UpdateUserDto = {
        userName: "Updated Name",
        email: "updated@example.com",
        country: "updatedCountry",
        profession: "updatedProfession",
      };

      // Mock the updateOne method of UserService
      const updatedUser = {
        id: 1,
        userName: "Updated Name",
        email: "updated@example.com",
        country: "updatedCountry",
        profession: "updatedProfession",
      };
      jest.spyOn(service, "updateOne").mockResolvedValue(updatedUser);

      // Call the updateOne method of UserController
      const result = await controller.updateOne(userId, updateData);

      // Verify that the userService.updateOne method was called with the correct parameters
      expect(service.updateOne).toHaveBeenCalledWith(+userId, updateData);

      // Verify that the returned result matches the updated user data
      expect(result).toEqual(updatedUser);
    });
  });

  describe("remove", () => {
    it("should remove a user by ID", async () => {
      // Mock data
      const userId = "1"; // ID of the user to remove

      // Mock the remove method of UserService
      const deleteResult: DeleteResult = {
        affected: 1,
        raw: undefined,
      }; // Simulate successful deletion
      jest.spyOn(service, "remove").mockResolvedValue(deleteResult);

      // Call the remove method of UserController
      const result = await controller.remove(userId);

      // Verify that the userService.remove method was called with the correct ID
      expect(service.remove).toHaveBeenCalledWith(+userId);

      // Verify that the result indicates successful deletion
      expect(result).toEqual(deleteResult);
    });
  });
});
