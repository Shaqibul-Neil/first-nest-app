import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ResponseMessage } from '../common/decorators/response-message/response-message.decorator';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ResponseMessage('Patient created successfully')
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.createPatient(createPatientDto);
  }

  @Get()
  @ResponseMessage('Patients retrieved successfully')
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Patients retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Delete(':id')
  @ResponseMessage('Patient deleted successfully')
  remove(@Param('id') id: string) {
    return this.patientsService.removePatient(id);
  }
}
