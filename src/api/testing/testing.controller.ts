import { Controller, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllDevicesCommnad } from '../security-devices/useCase/deleteAllDevices-use-case';
import { DeleteAllUsersCommnad } from '../users/useCase/deleteAllUsers-use-case';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('testing/all-data')
export class TestingController {
  constructor(
	protected readonly commandBus: CommandBus
  ) {}

  @Delete()
  @HttpCode(204)
  @SkipThrottle({default: true})
  async remove() {
    await this.commandBus.execute(new DeleteAllDevicesCommnad())
    await this.commandBus.execute(new DeleteAllUsersCommnad())
  }
}
