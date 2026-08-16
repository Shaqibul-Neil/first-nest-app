import { Injectable } from '@nestjs/common';
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

  async createStudent(data: Partial<Student>): Promise<Student> {
    const newStudent = new this.studentModel(data);
    return newStudent.save();
  }

  async getAllStudents(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async getStudentById(id: string): Promise<Student | null> {
    return this.studentModel.findById(id).exec();
  }

  // async updateStudent(data: Partial<Student>): Promise<Student> {
  //   return this.studentModel.findByIdAndUpdate(data.id);
  // }
}
