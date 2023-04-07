import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setTitle(`Task-project Api`)
    .setVersion('1.0')
    .addTag(`Task-project Api Api`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  const whiteList = [/\.\.uz$/, /\.\.uz$/, /http:\/\/localhost:[0-9]{4}$/];
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whiteList.some((w) => origin.match(w))) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  };
  await app.enableCors(corsOptions);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
