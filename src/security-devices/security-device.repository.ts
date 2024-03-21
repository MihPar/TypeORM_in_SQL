import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceClass } from './dto/device.class';
import { Device } from './entities/security-device.entity';
import { stringify } from 'querystring';

@Injectable()
export class DeviceRepository {
  constructor(
		@InjectRepository(Device) protected readonly deviceRepository: Repository<Device>	
	) {}

  async terminateSession(deviceId: string) {
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
			.values([
				{
				id: device.id,
				ip: device.ip,
				title: device.title,
				userId: device.userId,
				lastActiveDate: device.lastActiveDate
			}
		])
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
	const result = await this.deviceRepository
		.createQueryBuilder()
		.update(Device)
		.set({lastActiveDate: newLastActiveDate})
		.where("id = :deviceId", {deviceId})
		.andWhere('userId = :userId', {userId})
		.execute()
		
		return result
  }

  async logoutDevice(deviceId: string): Promise<boolean> {
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
