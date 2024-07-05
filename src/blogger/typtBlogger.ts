export interface CommentForCurrentBloggerResponse {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: AllCommentForCurrentBloggerView[];
  }

  export type AllCommentForCurrentBloggerView = {
	id: string;
	content: string;
	commentatorInfo: {
	  userId: string;
	  userLogin: string;
	};
	createdAt: Date;
	likesInfo: {
	  likesCount: number;
	  dislikesCount: number;
	  myStatus: string;
	};
	postInfo: {
	  id: string;
	  title: string;
	  blogId: string;
	  blogName: string;
	};
  };