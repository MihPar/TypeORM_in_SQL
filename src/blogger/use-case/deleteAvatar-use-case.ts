import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteAvatarCommand {
  constructor(
    public userId: string,
    public originalname: string,
    public fileId: string,
  ) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarUseCase
  implements ICommandHandler<DeleteAvatarCommand>
{
  s3Client: S3Client;
  bucketName = 'michael-paramonov';
  constructor() {
    const REGION = 'us-east-1';
    this.s3Client = new S3Client({
      region: REGION,
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        secretAccessKey: 'YCPYEGcmqi6x2EWQDk07BIBTgowJgFtN7CeEHI4n',
        accessKeyId: 'YCAJEXc7e_rINV6X5mObUjCJI',
      },
    });
  }

  async execute(command: DeleteAvatarCommand) {
    // const fileId = await this.userProfileRepo.getProfile(command.userId)
    `/content/users/${command.userId}/avatars/${command.userId}_avatar.png`;
    const bucketParams = {
      Bucket: this.bucketName,
      Key: command.fileId /* key */,
    };
    try {
      const data = await this.s3Client.send(
        new DeleteObjectCommand(bucketParams),
      );
      return data;
    } catch (exeption) {
      console.log('Exeption', exeption);
      throw exeption;
    }
  }
}
