import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TelegramAdapter } from './adapter/telegram.adapter';
import { TelegramController } from './api/telegramm.controler';
import { HandleTelegramUseCase } from './use-case/commandBus/handleTelegram.use-case';
import { HowManyTimeUseCase } from './use-case/commandBus/howManyTime.use-case';
import { GetAuthBotLinkUseCase } from './use-case/queryBus/getAuthBotLink-use-case';


const commandUserCase = [HandleTelegramUseCase, HowManyTimeUseCase];
const queryUseCase = [GetAuthBotLinkUseCase]

const repo = [];

const useGuard = [];

const adapter = [TelegramAdapter];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([]), CqrsModule],
  controllers: [TelegramController],
  providers: [...adapter, ...commandUserCase, ...queryUseCase],
})
export class TelegrammModule {}
