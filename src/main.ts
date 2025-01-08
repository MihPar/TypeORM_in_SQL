import dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './setting';
import { TelegramAdapter } from './telegramm/adapter/telegram.adapter';
import ngrok from 'ngrok';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app);
  await app.listen(4000);

  const telegramAdapter = await app.resolve<TelegramAdapter>(TelegramAdapter);
  //   const settings = {
  // 	currentAppBaseUrl: 'https://localhost:4000'
  //   }
  async function connectToNgrok(): Promise<string> {
    const url = await ngrok.connect(4000);
    return url;
  }
  // let baseUrl: any = settings.currentAppBaseUrl
  // if(true) {
  const baseUrl = await connectToNgrok();
  // }
  await telegramAdapter.setWebhook(baseUrl + '/integrations/telegram/webhook');
  console.log(baseUrl, ' your url');
}
bootstrap();
