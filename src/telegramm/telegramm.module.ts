import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';


const userCase = [];

const repo = [];

const useGuard = [];

const adapter = [];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([]), CqrsModule],
  controllers: [],
  providers: [],
})
export class TelegrammModule {}
