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

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  getAllStudents() {
    return this.studentsService.getAllStudents();
  }

  @Get(':id')
  getStudentsById(@Param('id') id: string) {
    return this.studentsService.getStudentsById(Number(id));
  }

  @Post()
  createStudent(@Body() body: { name: string; age: number }) {
    return this.studentsService.createStudent(body);
  }

  @Put(':id')
  updateStudent(
    @Param('id') id: string,
    @Body() body: { name: string; age: number },
  ) {
    return this.studentsService.updateStudent(Number(id), body);
  }

  @Patch(':id')
  patchStudent(
    @Param('id') id: string,
    body: Partial<{ name: string; age: number }>,
  ) {
    return this.studentsService.patchStudent(Number(id), body);
  }

  @Delete(':id')
  deleteStudent(@Param('id') id: string) {
    return this.studentsService.deleteStudent(Number(id));
  }
}
