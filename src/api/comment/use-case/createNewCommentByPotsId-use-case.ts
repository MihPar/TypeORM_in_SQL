import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentViewModel } from "../comment.type";
import { CommentRepository } from "../comment.repository";
import { LikeStatusEnum } from "../../likes/likes.emun";
import { NotFoundException } from "@nestjs/common";
import { InputModelContentePostClass } from "../../posts/dto/posts.class.pipe";
import { CommentClass } from "../comment.class";
import { User } from "../../users/entities/user.entity";
import { Comments } from "../entity/comment.entity";

export class CreateNewCommentByPostIdCommnad {
  constructor(
    public postId: string,
    public inputModelContent: InputModelContentePostClass,
    public user: User,
  ) {}
}

@CommandHandler(CreateNewCommentByPostIdCommnad)
export class CreateNewCommentByPostIdUseCase
  implements ICommandHandler<CreateNewCommentByPostIdCommnad>
{
  constructor(protected readonly commentRepository: CommentRepository) {}
  async execute(
    command: CreateNewCommentByPostIdCommnad
  ): Promise<CommentViewModel | null> {
    const userLogin = command.user.login;
    if (!command.user.id) return null;
    const userId = command.user.id;
    const newComment: Comments = new Comments()
      newComment.content = command.inputModelContent.content,
      newComment.postId = command.postId,
      newComment.userId = userId, 
	  newComment.userLogin = userLogin

	  const createNewComment: Comments | null =
      await this.commentRepository.createNewCommentPostId(newComment);
    if (!createNewComment) throw new NotFoundException("404");
    return CommentClass.getNewComments(createNewComment, LikeStatusEnum.None);
  }
}
