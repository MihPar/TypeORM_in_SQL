import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, ParseUUIDPipe, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommentQueryRepository } from './comment.queryRepository';
import { CommentViewModel } from './comment.type';
import { InputModelContent, InputModelLikeStatusClass, inputModelCommentId, inputModelId } from './dto/comment.class-pipe';
import { CommentRepository } from './comment.repository';
import { CommandBus } from '@nestjs/cqrs';
import { UserDecorator, UserIdDecorator } from '../users/infrastructure/decorators/decorator.user';
import { CommentClass } from './comment.class';
import { CheckRefreshTokenForGet } from '../blogs/use-case/bearer.authGetComment';
import { CheckRefreshTokenForComments } from './guards/bearer.authForComments';
import { User } from '../users/entities/user.entity';
import { UpdateLikestatusCommand } from './use-case/updateLikeStatus-use-case';
import { Comments } from './entity/comment.entity';
import { UpdateCommentByCommentIdCommand } from './use-case/updateCommentByCommentId-use-case';

// @SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(
    protected commentQueryRepository: CommentQueryRepository,
	protected commentRepository: CommentRepository,
	protected commandBus: CommandBus
  ) {}

  @HttpCode(204)
  @Put(':commentId/like-status')
  @UseGuards(CheckRefreshTokenForComments)
  async updateByCommentIdLikeStatus(
    @Body() status: InputModelLikeStatusClass,
    @Param() dto: inputModelCommentId,
    @UserIdDecorator() userId: string,
  ) {
	const command = new UpdateLikestatusCommand(status, dto.commentId, userId)
	const updateLikeStatus = await this.commandBus.execute(command)
	if (!updateLikeStatus) throw new NotFoundException('404')
	return 
  }

  @Put(':commentId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForComments)
  async updataCommetById(
	@Param() id: inputModelCommentId, 
	@Body() Dto: InputModelContent,
	@UserIdDecorator() userId: string,
	) {
    const isExistComment: Comments | null = await this.commentQueryRepository.findCommentByCommentId(id.commentId);
    if (!isExistComment) throw new NotFoundException('404');
    if (userId !== isExistComment.userId) { throw new ForbiddenException("403")}
	const command = new UpdateCommentByCommentIdCommand(id.commentId, Dto)
	const updateComment: boolean = await this.commandBus.execute<UpdateCommentByCommentIdCommand, boolean>(command)
    if (!updateComment) throw new NotFoundException('404');
	return
  }

  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(CheckRefreshTokenForComments)
  async deleteCommentById(
	@Param() Dto: inputModelCommentId,
	@UserIdDecorator() userId: string
	) {
    const isExistComment = await this.commentQueryRepository.findCommentByCommentId(Dto.commentId);
    if (!isExistComment) throw new NotFoundException("404")
    if (userId !== isExistComment.userId) { throw new ForbiddenException("403")}
    const deleteCommentById: boolean =
      await this.commentRepository.deleteCommentByCommentId(Dto.commentId);
    if (!deleteCommentById) throw new NotFoundException('404');
	return 
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(CheckRefreshTokenForGet)
  async getCommentById(
    @Param('id', ParseUUIDPipe) id: string,
    @UserIdDecorator() userId: string | null,
  ) {
	// const findComment = await this.commentQueryRepository.findCommentByCommentId(id)
	// // console.log("findComment: ", findComment)

	// if(!findComment) throw new NotFoundException('404')

    const getCommentById: CommentViewModel | null =
      await this.commentQueryRepository.findCommentById(id, userId);
    if (!getCommentById) throw new NotFoundException('Comments by id not found');
	// console.log("getCommentById in 86 strict: ", getCommentById)
    return getCommentById;
  }
}
