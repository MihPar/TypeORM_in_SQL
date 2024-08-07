import { ImageType, LikesInfoViewModel } from "../likes/likes.type";

export type PostsViewModel = {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: Date;
	extendedLikesInfo: LikesInfoViewModel,
	images: ImageType
  };