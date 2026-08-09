import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UppercasePipe } from '../common/pipes/uppercase/uppercase.pipe';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  getAllCustomers() {
    return this.customerService.getAllCustomers();
  }

  @Post()
  createCustomer(@Body(new UppercasePipe()) payload: CreateCustomerDto) {
    return this.customerService.createCustomer(payload);
  }
}
