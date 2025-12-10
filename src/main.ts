import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Enable CORS so Angular (http://localhost:4200) can talk to Nest
  app.enableCors({
    origin:[
      'http://localhost:4200',
      'https://vitalview-backend.onrender.com'
    ]
  });
  
  // await app.listen(process.env.PORT ?? 3000);
    await app.listen(3000);
}
bootstrap();
