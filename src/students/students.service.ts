import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StudentsService {
  private students = [
    { id: 1, name: 'Shaqibul', age: 35 },
    { id: 2, name: 'Islam', age: 33 },
    { id: 3, name: 'Neil', age: 31 },
  ];

  getAllStudents() {
    return this.students;
  }

  getStudentsById(id: number) {
    const student = this.students.find((st) => st.id === id);
    if (!student) throw new NotFoundException('Student Not Found');
    return student;
  }

  //POST
  createStudent(data: { name: string; age: number }) {
    const newStudent = {
      id: Date.now(),
      ...data,
    };

    this.students.push(newStudent);

    return newStudent;
  }

  //PUT
  updateStudent(id: number, data: { name: string; age: number }) {
    const idx = this.students.findIndex((st) => st.id === id);

    if (idx === -1) throw new NotFoundException('Student Not Found');

    const updatedStudent = (this.students[idx] = { id, ...data });

    return updatedStudent;
  }

  //PATCH
  patchStudent(id: number, data: Partial<{ name: string; age: number }>) {
    const student = this.getStudentsById(id);
    if (!student) throw new NotFoundException('Student Not Found');

    Object.assign(student, data);

    return student;
  }

  //DELETE
  deleteStudent(id: number) {
    const idx = this.students.findIndex((st) => st.id === id);

    if (idx === -1) throw new NotFoundException('Student Not Found');

    const deleted = this.students.splice(idx, 1);
    return { message: 'Student deleted', student: deleted };
  }
}
