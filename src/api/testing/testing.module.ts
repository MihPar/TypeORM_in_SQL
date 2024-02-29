import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './testing.controller';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { DeleteAllDevicesUseCase } from '../security-devices/useCase/deleteAllDevices-use-case';
import { DeleteAllUsersUseCase } from '../users/useCase/deleteAllUsers-use-case';
import { DeviceRepository } from '../security-devices/security-device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../security-devices/entities/security-device.entity';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { DeviceQueryRepository } from '../security-devices/security-deviceQuery.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Device, User]), CqrsModule],
  controllers: [TestingController],
  providers: [
    TestingService,
    DeleteAllDevicesUseCase,
    DeleteAllUsersUseCase,
    DeviceRepository,
    UsersRepository,
    UsersQueryRepository,
	DeviceQueryRepository
  ],
  exports: [DeleteAllDevicesUseCase, DeleteAllUsersUseCase]
})
export class TestingModule {}
