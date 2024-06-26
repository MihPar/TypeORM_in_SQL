import { Controller, Delete, Get, HttpCode, NotFoundException, Param, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { DeviceQueryRepository } from "./security-deviceQuery.repository";
import { DeviceRepository } from './security-device.repository';
import { Request } from "express";
import { CommandBus } from "@nestjs/cqrs";
import { PayloadAdapter } from "../auth/adapter/payload.adapter";
import { CheckRefreshToken } from "../auth/guards/checkRefreshToken";
import { TerminateAllCurrentSessionCommand } from "./useCase/terminateAllCurrentSeccion-use-case";
import { ForbiddenCalss } from "./gards/forbidden";
import { SkipThrottle } from "@nestjs/throttler";
import { User } from "../users/entities/user.entity";
import { UserDecorator, UserIdDecorator } from "../users/infrastructure/decorators/decorator.user";

// @SkipThrottle()
@Controller('security/devices')
export class SecurityDeviceController {
  constructor(
    protected deviceQueryRepository: DeviceQueryRepository,
    protected deviceRepository: DeviceRepository,
	protected commandBus: CommandBus,
	protected payloadAdapter: PayloadAdapter
  ) {}
  
  @Get('')
  @HttpCode(200)
//   @SkipThrottle({default: true})
  @UseGuards(CheckRefreshToken)
  async getDevicesUser(
    @UserDecorator() user: User,
    @UserIdDecorator() userId: string | null,
  ) {
    if (!userId) return null;
    return await this.deviceQueryRepository.getAllDevicesUser(userId);
  }

  @Delete('')
//   @SkipThrottle({default: true})
  @UseGuards(CheckRefreshToken)
  @HttpCode(204)
  async terminateCurrentSession(
    @UserDecorator() user: User,
    @UserIdDecorator() userId: string | null,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    if (!userId) return null;
    const refreshToken = req.cookies.refreshToken;
    const payload = await this.payloadAdapter.getPayload(refreshToken);
    if (!payload) throw new UnauthorizedException('401');
	const command = new TerminateAllCurrentSessionCommand(userId, payload.deviceId)
	  const findAllCurrentDevices =
      await this.commandBus.execute(command)
    if (!findAllCurrentDevices) throw new UnauthorizedException('401');
  }

  @Delete(':deviceId')
  @HttpCode(204)
//   @SkipThrottle({default: true})
  @UseGuards(CheckRefreshToken, ForbiddenCalss)
  async terminateSessionById(@Param('deviceId') deviceId: string) {
	const deleteDeviceById = await this.deviceRepository.terminateSession(deviceId);
	if (!deleteDeviceById) throw new NotFoundException("404")
	return
  }
}