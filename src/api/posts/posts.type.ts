import { LikesInfoViewModel } from "../likes/likes.type";

export type PostsViewModel = {
	id: number;
	title: string;
	shortDescription: string;
	content: string;
	blogId: number;
	blogName: string;
	createdAt: Date;
	extendedLikesInfo: LikesInfoViewModel,
  };