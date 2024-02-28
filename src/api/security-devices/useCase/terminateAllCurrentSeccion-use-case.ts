import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeviceQueryRepository } from "../security-deviceQuery.repository";
import { HttpException } from "@nestjs/common";
import { DeviceRepository } from "../security-device.repository";
import { Device, DeviceView } from "../entities/security-device.entity";

export class TerminateAllCurrentSessionCommand {
	constructor(
		public userId: string | null,
		public deviceId: number
	) {}
}

@CommandHandler(TerminateAllCurrentSessionCommand)
export class TerminateAllCurrentSessionUseCase implements ICommandHandler<TerminateAllCurrentSessionCommand> {
	constructor(
		protected readonly deviceQueryRepository: DeviceQueryRepository,
		protected readonly deviceRepository: DeviceRepository
	) {}
	async execute(command: TerminateAllCurrentSessionCommand): Promise<boolean> {
		if(!command.userId) throw new HttpException('Bad request', 400)
			const findSession: DeviceView[] = await this.deviceQueryRepository.getAllDevicesUser(
				command.userId,
			);
			if (!findSession) {
			  return false;
			}
			for (let session of findSession) {
			  if (session.deviceId !== command.deviceId) {
				await this.deviceRepository.terminateSession(session.deviceId);
			  }
			}
			return true;
	}
}