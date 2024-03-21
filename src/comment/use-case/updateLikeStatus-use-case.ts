import { InputModelLikeStatusClass, inputModelCommentId } from "../dto/comment.class-pipe";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentRepository } from "../comment.repository";
import { LikesRepository } from "../../likes/likes.repository";
import { CommentClass } from "../comment.class";
import { CommentQueryRepository } from "../comment.queryRepository";
import { NotFoundException } from "@nestjs/common";
import { Comments } from "../entity/comment.entity";

export class UpdateLikestatusCommand {
	constructor(
		public status: InputModelLikeStatusClass,
		public id: string,
		public userId: string
	) {}
}

@CommandHandler(UpdateLikestatusCommand)
export class UpdateLikestatusForCommentUseCase implements ICommandHandler<UpdateLikestatusCommand> {
	constructor(
		protected readonly likesRepository: LikesRepository,
		protected readonly commentRepositoriy: CommentRepository,
		protected readonly commentQueryRepository: CommentQueryRepository

	) {}
	async execute(command: UpdateLikestatusCommand): Promise<boolean> {
		const findCommentById: Comments | null =
      await this.commentQueryRepository.findCommentByCommentId(command.id, command.userId);
    if (!findCommentById) throw new NotFoundException('404');
		const findLike = await this.likesRepository.findLikeByCommentIdBy(command.id, command.userId)
		// console.log("findLike: ", findLike)
	if(!findLike) {
		await this.likesRepository.saveLikeForComment(command.id, command.userId, command.status.likeStatus)
		const resultCheckLikeOrDislike = await this.commentRepositoriy.increase(command.id, command.status.likeStatus)
		return true
	} 
	
	if(findLike.myStatus === 'Dislike' && command.status.likeStatus === 'None') {
		await this.likesRepository.updateLikeStatusForComment(command.id, command.userId, command.status.likeStatus)
		const resultCheckListOrDislike = await this.commentRepositoriy.decreaseDislike(command.id, findLike.myStatus)
		return true
	}

	if(findLike.myStatus === 'Like' && command.status.likeStatus === "None") {
		await this.likesRepository.updateLikeStatusForComment(command.id, command.userId, command.status.likeStatus)
		const resultCheckListOrDislike = await this.commentRepositoriy.decreaseLike(command.id, findLike.myStatus)
		return true
	}

	if(findLike.myStatus === 'None' && (command.status.likeStatus === 'Dislike' || command.status.likeStatus === 'Like')) {
		await this.likesRepository.updateLikeStatusForComment(command.id, command.userId, command.status.likeStatus)
		const resultCheckListOrDislike = await this.commentRepositoriy.increase(command.id, command.status.likeStatus)
		return true
	}

	if(findLike.myStatus === 'Dislike' && command.status.likeStatus === 'Like') {
		await this.likesRepository.updateLikeStatusForComment(command.id, command.userId, command.status.likeStatus)
		const increaseLikeCount = await this.commentRepositoriy.increaseLike(command.id, command.status.likeStatus)
		const decreaseDislikeCount = await this.commentRepositoriy.decreaseDislike(command.id, findLike.myStatus)
		return true
	}
	if(findLike.myStatus === 'Like' && command.status.likeStatus === 'Dislike') {
		await this.likesRepository.updateLikeStatusForComment(command.id, command.userId, command.status.likeStatus)
		const decreaseLikeCount = await this.commentRepositoriy.decreaseLike(command.id, findLike.myStatus)
		const increaseDislikeCount = await this.commentRepositoriy.increaseDislike(command.id, command.status.likeStatus)
		return true
	}
	return true
	}
}
