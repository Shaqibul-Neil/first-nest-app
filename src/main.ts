import * as dns from 'node:dns';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Node's c-ares resolver picks up the VPN/WARP loopback nameserver, which
// refuses the SRV lookup that `mongodb+srv://` depends on. Point it at public
// resolvers so Atlas discovery works.
dns.setServers(['1.1.1.1', '8.8.8.8']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);

  app.enableShutdownHooks();
}
bootstrap();
