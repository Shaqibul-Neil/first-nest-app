import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    //class name is student.name not every students name
    // student.name	একজন student's name
    // Student.name	class-এর নাম "Student"
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
