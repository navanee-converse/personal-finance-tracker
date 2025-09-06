import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guard/auth.guard';
import { CustomExceptionFilter } from './filter/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new CustomExceptionFilter())
  await app.listen(process.env.APP_PORT ?? 8000);
}
bootstrap();
