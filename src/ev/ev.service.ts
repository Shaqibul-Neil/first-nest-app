import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EvService {
  constructor(private configService: ConfigService) {}

  getDBUrl() {
    return this.configService.get<string>('MONGODB_DATABASE_URL');
  }
}
