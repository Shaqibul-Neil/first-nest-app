import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './student.schema';
import { Model } from 'mongoose';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}
  // Student       → class
  // StudentSchema → schema
  // studentModel  → mongoose model
  // StudentDocument → mongoose document type

  //Create student
  async createStudent(data: Partial<Student>): Promise<Student> {
    const newStudent = new this.studentModel(data);
    return newStudent.save();
  }
}
