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
      transform: true, // body ke CreatePatientDto class-er instance baniye controller e pathay. Chara: plain object ashe, dto instanceof CreatePatientDto → false
      /**@Type(() => ProfileDto) transform chara-o validation-er somoy kaj kore (class-validator bhitore nijei instance banay), kintu controller e ja pouchay ta plain object thake. Difference:
// transform: false
dto.profile.constructor.name   // "Object"

// transform: true
dto.profile.constructor.name   // "ProfileDto" */
      transformOptions: { enableImplicitConversion: false },
      //transformOptions: { enableImplicitConversion: false } → strict rakhe. true dile "26" (string) chup kore 26 (number) hoye jabe, @IsInt() pass kore jabe. Client bhul type pathacche ta amra jante-i parbo na. false = 400 error, thik moto.
    }),
  );

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
