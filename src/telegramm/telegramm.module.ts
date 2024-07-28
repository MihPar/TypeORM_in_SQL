import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TelegramAdapter } from './adapter/telegram.adapter';
import { TelegramController } from './api/telegramm.controler';


const userCase = [];

const repo = [];

const useGuard = [];

const adapter = [TelegramAdapter];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([]), CqrsModule],
  controllers: [TelegramController],
  providers: [...adapter],
})
export class TelegrammModule {}
