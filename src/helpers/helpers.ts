import request from 'supertest';
import { InputModelClassCreateBody } from '../api/users/user.class';
import { Posts } from '../api/posts/entity/entity.posts';
import { LikeStatusEnum } from '../api/likes/likes.emun';
import { PostsViewModel } from '../api/posts/posts.type';
import { CommentViewModel } from '../api/comment/comment.type';
import { Comments } from '../api/comment/entity/comment.entity';

export const commentDBToView = (
  item: Comments, 
  myStatus: LikeStatusEnum | null
): CommentViewModel => {
  return {
    id: item.id,
    content: item.content,
    // commentatorInfo: item.commentatorInfo,
    commentatorInfo: {
		userId: item.userId,
		userLogin: item.userLogin
	},
    createdAt: item.createdAt,
    likesInfo: {
      likesCount: item?.likesCount || 0,
      dislikesCount: item?.dislikesCount || 0,
      myStatus: myStatus || LikeStatusEnum.None
    },
  };
};

// export const commentByPostView = (
// 	item: CommentClass,
//     myStatus?: LikeStatusEnum | null
//   ): CommentViewModel => {
// 	return {
// 	  id: item.id,
// 	  content: item.content,
// 	  commentatorInfo: item.commentatorInfo,
// 	  createdAt: item.createdAt,
// 	  likesInfo: {
// 		likesCount: item?.likesCount || 0,
// 		dislikesCount: item?.dislikesCount || 0,
// 		myStatus: myStatus || LikeStatusEnum.None,
// 	  },
// 	};
//   };

  
export const createAddUser = async (server: any, body: InputModelClassCreateBody) => {
	const createUser = await request(server)
	  .post(`/users`)
	  .auth('admin', 'qwerty')
	  .send(body)
	  return createUser
}

export const createToken = async (server: any, loginOrEmail: string, password: string) => {
	const createAccessToken = await request(server)
		.post('/auth/login')
		.send({
		  loginOrEmail,
		  password
		});
	return createAccessToken
}

export const aDescribe = (skip: boolean): jest.Describe => {
	if(skip) {return describe.skip}
	return describe
}