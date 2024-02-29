import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { randomUUID } from 'crypto';
import { DeviceRepository } from '../../security-devices/security-device.repository';
import { ApiJwtService } from '../../../infrastructura/jwt/jwt.service';
import { DeviceClass } from '../../security-devices/dto/device.class';
import { Device } from 'src/api/security-devices/entities/security-device.entity';
import { User } from 'src/api/users/entities/user.entity';

export class CreateDeviceCommand {
	constructor(
		public IP: string, 
		public deviceName: string,
		public user: User,
	) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase implements ICommandHandler<CreateDeviceCommand> {
	constructor(
		protected readonly deviceRepository: DeviceRepository,
		protected readonly jwtService: JwtService,
		protected readonly apiJwtService: ApiJwtService,

	) {}
	async execute(
		command: CreateDeviceCommand
	  ): Promise<{refreshToken: string, token: string} | null> {
		try {
			const deviceId = randomUUID()
			const {accessToken, refreshToken} = await this.apiJwtService.createJWT(command.user.id.toString(), deviceId)
			const payload = await this.jwtService.decode(refreshToken);
			const date = payload.iat * 1000
			const ip = command.IP || "unknown";
			// const title = command.Headers["user-agent"] || "unknown";
	
			const device  = new Device()
			device.ip = ip
			device.id = Number(deviceId)
			device.lastActiveDate = new Date(date)
			device.title = command.deviceName
			device.userId = command.user.id.toString()
			
			const createdDevice: boolean | null = await this.deviceRepository.createDevice(device);
	
			if(!createdDevice){
				return null
			}
			return {
				refreshToken,
				token: accessToken
			};
		} catch(error) {
			console.log("WIOERUWEFJSDKFJSDFSDIFSFISFISEISEF: ", error)
		}
		return null
	  }
}