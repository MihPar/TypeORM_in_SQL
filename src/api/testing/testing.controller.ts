import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllDevicesCommnad } from '../security-devices/useCase/deleteAllDevices-use-case';
import { DeleteAllUsersCommnad } from '../users/useCase/deleteAllUsers-use-case';

@Controller('testing/all-data')
export class TestingController {
  constructor(
	protected readonly commandBus: CommandBus
  ) {}

  @Delete()
  async remove() {
    await this.commandBus.execute(new DeleteAllDevicesCommnad())
    await this.commandBus.execute(new DeleteAllUsersCommnad())
  }
}
