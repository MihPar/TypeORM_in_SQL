import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Telegraf } from 'telegraf';
import { TelegramUpdateMessage } from "../../types";
import { TelegramAdapter } from "../../adapter/telegram.adapter";


export class GetAuthBotLinkQuery {
	constructor(
		public payload: TelegramUpdateMessage
	) {}
}

@QueryHandler(GetAuthBotLinkQuery)
export class GetAuthBotLinkUseCase implements IQueryHandler<GetAuthBotLinkQuery> {
	constructor(
		protected readonly telegramAdapter: TelegramAdapter
	) {}
	async execute(query: GetAuthBotLinkQuery): Promise<any> {

		const getAuhBotLink = await this.telegramAdapter.getLink()
		return getAuhBotLink


		// const bot = new Telegraf(process.env.TOKEN_TELEGRAM);
// bot.launch();

// Получаем ссылку на бота
// const botLink = `https://t.me/${bot.telegram}`
// console.log("botLink: ", bot.telegram)
// return botLink

// // Создаем обработчик сообщений для проверки подлинности пользователя
// bot.start(async (ctx) => {
//   // Проверяем, есть ли у пользователя личный код
//   if (!ctx.session.personalCode) {
//     // Создаем параметр для хранения личного кода пользователя
//     const userCodeKeyboard = bot.keyboard([
//       ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
//     ]);

//     // Отправляем пользователю сообщение с просьбой ввести личный код
//     await ctx.reply('Введите ваш личный код', { reply_markup: userCodeKeyboard });
//   } else {
//     // Пользователь уже авторизован
//     await ctx.reply('Вы уже авторизованы');
//   }
// });

// // Обрабатываем ввод личного кода пользователя
// bot.on('text', async (ctx) => {
//   const personalCode = ctx.message.text;

//   // Проверяем, является ли введенный код верным
//   if (personalCode === '12345') {
//     // Сохраняем личный код в сессии пользователя
//     ctx.session.personalCode = personalCode;

//     // Отправляем пользователю сообщение с подтверждением
//     await ctx.reply('Вы успешно авторизованы');
//   } else {
//     // Личный код неверен
//     await ctx.reply('Неверный личный код');
//   }
// });

// // Запускаем бота
// bot.launch();

// // Получаем ссылку на бота
// const botLink = `https://t.me/${bot.telegram.botInfo.username}?start=${ctx.session.personalCode}`;
	}
}