import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  private employees = [
    { id: 1, name: 'Shaqibul', designation: 'Web Developer' },
    { id: 2, name: 'Islam', designation: 'Ai Developer' },
    { id: 3, name: 'Neil', designation: 'Full Stack Developer' },
  ];

  getAllEmployees() {
    return this.employees;
  }

  getEmployeeById(id: number) {
    return this.employees.find((employee) => employee.id === id);
  }
}
