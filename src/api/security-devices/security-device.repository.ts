import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceClass } from './dto/device.class';
import { Device } from './entities/security-device.entity';

@Injectable()
export class DeviceRepository {
  constructor(
		@InjectRepository(Device) protected readonly deviceRepository: Repository<Device>	
	) {}

  async terminateSession(deviceId: number) {
	const terminator = await this.deviceRepository
		.createQueryBuilder()
		.delete()
		.from(Device)
		.where("id = :id", {id: deviceId})
		.execute()

		if (!terminator) return false;
    return true;
  }

  async deleteAllDevices() {
	await this.deviceRepository
		.createQueryBuilder("d")
		.delete()
		.from("device")
		.execute()
    return true;
  }

  async createDevice(device: Device): Promise<boolean | null> {
    try {
		await this.deviceRepository
			.createQueryBuilder()
			.insert()
			.into(Device)
			.values({
				ip: device.ip,
				title: device.title,
				userId: device.userId,
				lastActiveDate: device.lastActiveDate
			})
			.execute()
     return true
    } catch (error) {
      console.log(error, "error in create device");
      return null
    }
  }

  async updateDeviceUser(
    userId: string,
    deviceId: string,
    newLastActiveDate: string
  ) {
	await this.deviceRepository
		.createQueryBuilder("d")
		.update("device")
		.set({lastActiveDate: newLastActiveDate})
		.where("d.id = :deviceId, d.userId = :userId", {deviceId, userId})
		.execute()
  }

  async logoutDevice(deviceId: number): Promise<boolean> {
	const deleteDevice = await this.deviceRepository
		.createQueryBuilder()
		.delete()
		.from(Device)
		.where("id = :id", {id: deviceId})
		.execute()
	
    if (!deleteDevice) return false;
    return true;
  }
}
