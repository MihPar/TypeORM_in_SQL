import { likeInfoType } from "../../api/likes/likes.type"
import { LikeStatusEnum } from "../likes/likes.emun"

export type CommentViewModel = {
	id: number
	content: string
	commentatorInfo: CommentatorInfoType
	createdAt: Date
	likesInfo: likeInfoType
}


export type CommentatorInfoType = {
	userId: number;
	userLogin: string;
  };

export type inputModeContentType = {
	content: string
}

export type CommentViewType = {
	id: string
	content: string
	commentatorInfo: {
	  userId: string
	  userLogin: string
	},
	createdAt: string
	likesInfo: {
	  likesCount: number
	  dislikesCount: number
	  myStatus: string
	}
  }