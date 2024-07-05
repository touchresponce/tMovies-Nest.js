import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const { NODE_ENV, PORT, DEV_CORS_ORIGIN, PROD_CORS_ORIGIN } = process.env;

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: NODE_ENV === 'production' ? PROD_CORS_ORIGIN : DEV_CORS_ORIGIN,
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  await app.listen(PORT);
}
bootstrap();
