import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { EmployeeModule } from './employee/employee.module';
import { CategoryModule } from './category/category.module';
import { StudentsModule } from './students/students.module';
import { CustomerModule } from './customer/customer.module';
import { UserRolesController } from './user-roles/user-roles.controller';

@Module({
  imports: [EmployeeModule, CategoryModule, StudentsModule, CustomerModule],
  controllers: [
    AppController,
    UserController,
    ProductController,
    UserRolesController,
  ],
  providers: [AppService, ProductService],
})
export class AppModule {}
