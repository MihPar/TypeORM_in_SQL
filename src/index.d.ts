import { UserClass } from "./users/user.class";

declare global {
	namespace Express {
		export interface Request {
			user: UserClass | null
		}
	}
}