import { Controller, Delete, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllDevicesCommnad } from '../security-devices/useCase/deleteAllDevices-use-case';
import { DeleteAllUsersCommnad } from '../users/useCase/deleteAllUsers-use-case';
import { DeleteAllPostsComand } from '../posts/use-case/deleteAllPosts-use-case';
import { DeleteAllBlogsCommnad } from '../blogs/use-case/deletAllBlogs-use-case';
import { DeleteAllBlogsForSACommnad } from '../blogsForSA/use-case/deletAllBlogs-use-case';
import { DeleteAllCommentLikesCommand } from '../likes/use-case/deleteAllCommentLikes-use-case copy';
import { DeleteAllPostLikesCommand } from '../likes/use-case/deleteAllPostLikes-use-case';
import { DeleteAllCommentsCommand } from '../comment/use-case/deleteAllComments-use-case';
import { DeleteAllPairQuizGameCommnad } from '../pairQuizGame/useCase/deleteAllPairQuizGamep-use-case';
import { DeleteAllAnswersPlayerCommand } from '../pairQuizGameProgress/useCase/deleteAllAnswersFirstPlayer';
import { DeleteAllQuestionCommand } from '../question/useCases/deleteAllQuestions-use-case';
import { DeleteAllPairQuizGameProgressPlayerCommand } from '../pairQuizGameProgress/useCase/deleteAllPairQuizGameProgressFirstPlayer';
import { DelectAllQuestionGamesCommand } from '../pairQuizGame/useCase/deleteAllQuestionGames-use-case';
import { DeleteUserBloggerCommand } from '../blogger/use-case/deleteUserBlogger-use-case';
import { DeleteAllWallpaperCommand } from '../blogs/use-case/deleteAllWallpaper-use-case';
import { DeleteAllMainCommand } from '../blogs/use-case/deleteAllMain-use-case copy';

// @UseGuards(ThrottlerGuard)
@Controller('testing/all-data')
export class TestingController {
  constructor(protected readonly commandBus: CommandBus) {}

  @Delete()
  @HttpCode(204)
  //   @SkipThrottle({default: true})
  async remove() {
    await this.commandBus.execute(new DelectAllQuestionGamesCommand());
    await this.commandBus.execute(new DeleteAllPairQuizGameCommnad());
    await this.commandBus.execute(new DeleteAllAnswersPlayerCommand());
    await this.commandBus.execute(
      new DeleteAllPairQuizGameProgressPlayerCommand(),
    );
    await this.commandBus.execute(new DeleteAllQuestionCommand());
	await this.commandBus.execute(new DeleteAllWallpaperCommand())
	await this.commandBus.execute(new DeleteAllMainCommand())
    await this.commandBus.execute(new DeleteAllDevicesCommnad());
    await this.commandBus.execute(new DeleteAllCommentLikesCommand());
    await this.commandBus.execute(new DeleteAllPostLikesCommand());
    await this.commandBus.execute(new DeleteAllCommentsCommand());
    await this.commandBus.execute(new DeleteAllPostsComand());
	await this.commandBus.execute(new DeleteUserBloggerCommand())
    await this.commandBus.execute(new DeleteAllBlogsCommnad());
    await this.commandBus.execute(new DeleteAllBlogsForSACommnad());
    await this.commandBus.execute(new DeleteAllUsersCommnad());
  }
}
