import { S3Client } from "@aws-sdk/client-s3";

export class S3StorageAdapter {
	s3Client: S3Client
	constructor() {
		const REGION = 'us-east-1'
		this.s3Client = new S3Client({
			region: REGION,
			endpoint: 'https://storage.yandexcloud.net',
			credentials: {
				secretAccessKey: "YCPYEGcmqi6x2EWQDk07BIBTgowJgFtN7CeEHI4n",
				accessKeyId: 'YCAJEXc7e_rINV6X5mObUjCJI'
			}
		})
	}
}