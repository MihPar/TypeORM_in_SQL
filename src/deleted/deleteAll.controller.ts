import { Controller, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllDevicesCommnad } from '../security-devices/useCase/deleteAllDevices-use-case';
import { DeleteAllUsersCommnad } from '../users/useCase/deleteAllUsers-use-case';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { DeleteAllPostsComand } from '../posts/use-case/deleteAllPosts-use-case';
import { DeleteAllBlogsCommnad } from '../blogs/use-case/deletAllBlogs-use-case';
import { DeleteAllBlogsForSACommnad } from '../blogsForSA/use-case/deletAllBlogs-use-case';
import { DeleteAllCommentLikesCommand } from '../likes/use-case/deleteAllCommentLikes-use-case copy';
import { DeleteAllPostLikesCommand } from '../likes/use-case/deleteAllPostLikes-use-case';
import { DeleteAllCommentsCommand } from '../comment/use-case/deleteAllComments-use-case';

// @UseGuards(ThrottlerGuard)
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
    await this.commandBus.execute(new DeleteAllCommentLikesCommand())
    await this.commandBus.execute(new DeleteAllPostLikesCommand())
    await this.commandBus.execute(new DeleteAllCommentsCommand())
    await this.commandBus.execute(new DeleteAllPostsComand())
    await this.commandBus.execute(new DeleteAllBlogsCommnad())
    await this.commandBus.execute(new DeleteAllBlogsForSACommnad())
    await this.commandBus.execute(new DeleteAllUsersCommnad())
  }
}
