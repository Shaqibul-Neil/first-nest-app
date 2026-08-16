import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from './student.schema';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async addStudent(@Body() data: Partial<Student>) {
    return this.studentsService.createStudent(data);
  }
}
