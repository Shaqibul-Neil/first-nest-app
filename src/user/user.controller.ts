import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  addUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }
  @Get()
  getAllUser() {
    return this.userService.getAllUsers();
  }

  @Get('lean')
  getAllUserLean() {
    return this.userService.getAllUsersLean();
  }

  @Get('compare')
  compare() {
    return this.userService.compareHydratedVsLean();
  }
}
