import { Injectable } from '@nestjs/common';
import { ICustomer } from './interfaces/customer.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  private customers: ICustomer[] = [
    { id: 1, name: 'Shaqibul', age: 35 },
    { id: 2, name: 'Islam', age: 33 },
    { id: 3, name: 'Neil', age: 31 },
  ];

  getAllCustomers(): ICustomer[] {
    return this.customers;
  }

  createCustomer(payload: CreateCustomerDto): ICustomer {
    const newCustomer: ICustomer = {
      id: Date.now(),
      ...payload,
    };

    this.customers.push(newCustomer);

    return newCustomer;
  }
}
