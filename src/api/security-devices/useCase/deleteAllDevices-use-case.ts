import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeviceRepository } from "../security-device.repository";
import { Injectable } from "@nestjs/common";

export class DeleteAllDevicesCommnad {
	constructor() {}
}

@Injectable()
@CommandHandler(DeleteAllDevicesCommnad)
export class DeleteAllDevicesUseCase implements ICommandHandler<DeleteAllDevicesCommnad> {
	constructor(
		protected readonly deviceRepository: DeviceRepository
	) {}
 	async execute(command: DeleteAllDevicesCommnad): Promise<any> {
		return await this.deviceRepository.deleteAllDevices();
	}
}