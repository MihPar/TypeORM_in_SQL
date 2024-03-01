import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Device, DeviceView } from "./entities/security-device.entity";

@Injectable()
export class DeviceQueryRepository {
	constructor(
		// @InjectDataSource() protected dataSource: DataSource
		@InjectRepository(Device) protected readonly repository: Repository<Device>
	) {}
	// async getDevicesUser(userId: string) {
	// 	const query = `
	// 		SELECT *
	// 			FROM public."Devices"
	// 			WHERE "userId" = $1
	// `
	// 	const getDevice = (await this.dataSource.query(query, [userId]))[0]
	// 	return getDevice
	// }

async findDeviceByDeviceId(deviceId: string) {
	const findDeviceById: Device = await this.repository
		.createQueryBuilder()
		.select("device")
		.from(Device, "device")
		.where("device.id = :id", {id: deviceId})
		.getOne()
    
    return findDeviceById ? {
      ip: findDeviceById.ip,
      title: findDeviceById.title,
      deviceId: findDeviceById.id,
      userId: findDeviceById.userId,
      lastActiveDate: findDeviceById.lastActiveDate,
    } : null
  }

	async getAllDevicesUser(userId: string): Promise<DeviceView[]> {
		const getAllDevices = await this.repository
			.createQueryBuilder()
			.select("device")
			.from(Device, "device")
			.where("device.userId = :id", {id: userId})
			.getMany()

		return getAllDevices.map(function (item: Device) {
		  return {
			ip: item.ip,
			title: item.title,
			lastActiveDate: item.lastActiveDate,
			deviceId: item.id,
		  };
		});
	}
}