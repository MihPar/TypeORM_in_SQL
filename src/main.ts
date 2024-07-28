import dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './setting';
import { TelegramAdapter } from './telegramm/adapter/telegram.adapter';

const axios = require('axios')


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app)
  await app.listen(4000);

  const telegramAdapter = await app.resolve<TelegramAdapter>(TelegramAdapter)
  
//   const settings = {
// 	currentAppBaseUrl: 'https://localhost:4000'
//   }

//   async function conectToNgrok(): Promise<string> {
// 	const url = await ngrok.connect(4000)
// 	return url
// 	}
	
	// let baseUrl: any = settings.currentAppBaseUrl
	// if(true) {
		// const baseUrl = await ngrok.connect(4000)
	// }
	await telegramAdapter.setWebhook('https://localhost:4000' + '/integrations/telegram/webhook')

}
bootstrap();
