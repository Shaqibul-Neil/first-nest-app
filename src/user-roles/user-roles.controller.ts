import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization/authorization.guard';
import { Roles } from '../guards/authorization/authorization.decorator';
import { TRole } from '../guards/authorization/authorization.enum';

@Controller('user-roles')
export class UserRolesController {
  @Get('admin-data')
  @UseGuards(AuthorizationGuard)
  @Roles(TRole.Admin)
  getAdminData() {
    return { message: 'Only Admin can access' };
  }

  @Get('user-data')
  getUserData() {
    return { message: 'Anyone can access' };
  }
}
