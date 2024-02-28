import { Module } from '@nestjs/common';
import { SecurityDeviceController } from './device.controller';
import { DeleteAllDevicesUseCase } from './useCase/deleteAllDevices-use-case';
import { LogoutUseCase } from './useCase/logout-use-case';
import { TerminateAllCurrentSessionUseCase } from './useCase/terminateAllCurrentSeccion-use-case';
import { UpdateDeviceUseCase } from './useCase/updateDevice-use-case';
import { TypeOrmModule } from '@nestjs/typeorm';

const useCase = [
  DeleteAllDevicesUseCase,
  LogoutUseCase,
  TerminateAllCurrentSessionUseCase,
  UpdateDeviceUseCase,
];
@Module({
  imports: [TypeOrmModule.forFeature([Devices])],
  controllers: [SecurityDeviceController],
  providers: [...useCase],
})
export class SecurityDevicesModule {}
