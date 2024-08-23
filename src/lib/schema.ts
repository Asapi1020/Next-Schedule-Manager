export interface BaseAccountInfo {
	id: string;
	name: string;
	avatarHash: string;
}

export interface BaseGroupInfo {
	id: string;
	name: string;
	adminId: string;
}

export interface User {
	id: string;
	name: string;
	groupsId: string[];
}

export interface Account extends BaseAccountInfo {
	userId: string;
}

export interface Group extends BaseGroupInfo {
	usersId: string[];
}

export interface Schedule {
	id: string;
	userId: string;
	groupId: string;
	//status
}

export interface UserProfile {
	id: string;
	accountId: string;
	name: string;
	avatarHash: string;
	groups: BaseGroupInfo[];
}

// export interface UserWithAccessToken {
// 	accessToken: string;
// 	user: UserInfo;
// }
