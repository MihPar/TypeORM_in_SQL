import { InputModelLikeStatusClass } from '../../comment/dto/comment.class-pipe';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikesRepository } from "../../likes/likes.repository";
import { PostsRepository } from "../posts.repository";
import { PostsQueryRepository } from '../postQuery.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { LikeStatusEnum } from '../../likes/likes.emun';

export class UpdateLikeStatusCommand {
	constructor(
		public status: InputModelLikeStatusClass,
		public postId: string, 
		public userId: string | null,
		public user: User
	) {}
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusForPostUseCase implements ICommandHandler<UpdateLikeStatusCommand> {
	constructor(
		protected readonly likesRepository: LikesRepository,
		protected readonly postsRepository: PostsRepository,
		protected readonly postsQueryRepository: PostsQueryRepository
	) {}
	async execute(command: UpdateLikeStatusCommand): Promise<boolean | void | null> {
	if(!command.userId) return null

		const findPost = await this.postsQueryRepository.getPostById(command.postId);
    if (!findPost) throw new NotFoundException('404')
	
		const userLogin = command.user.login
		if(!command.userId) return null
		const userId = command.userId
		const findLike = await this.likesRepository.findLikeByPostId(command.postId, command.userId!)

  	if(!findLike) {
		await this.likesRepository.saveLikeForPost(command.postId, userId, command.status.likeStatus, userLogin)
		const resultCheckListOrDislike = await this.postsRepository.increase(command.postId, command.status.likeStatus, userId)
		return true
	} 
	
	if(findLike.myStatus === 'Dislike' && command.status.likeStatus === 'None'){
		await this.likesRepository.updateLikeStatusForPost(command.postId, command.status.likeStatus, userId)
		const decreaseLikeCount = await this.postsRepository.decreaseDislike(command.postId, findLike.myStatus, userId)
		return true
	}

	if(findLike.myStatus === 'Like' && command.status.likeStatus === 'None'){
		await this.likesRepository.updateLikeStatusForPost(command.postId, command.status.likeStatus, userId)
		const decreaseLikeCount = await this.postsRepository.decreaseLike(command.postId, findLike.myStatus, userId)
		return true
	}

	if(findLike.myStatus === 'None' && (command.status.likeStatus === 'Dislike' || command.status.likeStatus === 'Like')) {
		await this.likesRepository.updateLikeStatusForPost(command.postId, command.status.likeStatus, userId)
		const resultCheckListOrDislike = await this.postsRepository.increase(command.postId, command.status.likeStatus, userId)
		return true
	}

	if(findLike.myStatus === 'Dislike' && command.status.likeStatus === 'Like') {
		await this.likesRepository.updateLikeStatusForPost(command.postId, command.status.likeStatus, userId)
		const increaseLikeCount = await this.postsRepository.increaseLike(command.postId, command.status.likeStatus, userId)
		const decreaseDislikeCount = await this.postsRepository.decreaseDislike(command.postId, findLike.myStatus, userId)
		return true
	}
	if(findLike.myStatus === 'Like' && command.status.likeStatus === 'Dislike') {
		await this.likesRepository.updateLikeStatusForPost(command.postId, command.status.likeStatus, userId)
		const decreaseLikeCount = await this.postsRepository.decreaseLike(command.postId, findLike.myStatus, userId)
		const increaseDislikeCount = await this.postsRepository.increaseDislike(command.postId, command.status.likeStatus, userId)
		return true
	}
	return true
	}
}