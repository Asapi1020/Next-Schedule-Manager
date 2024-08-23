export interface User {
	id: string;
	name: string;
	groupsId: string[];
}

export interface Account extends BaseAccountInfo {
	userId: string;
}

export interface Group {
	id: string;
	name: string;
	adminId: string;
	usersId: string[];
}

export interface Schedule {
	id: string;
	userId: string;
	groupId: string;
	//status
}

// export interface UserInfo {
// 	id: string;
// 	accountId: string;
// 	name: string;
// 	avatarHash: string;
// 	groups: GroupInfo[];
// }

export interface BaseAccountInfo {
	id: string;
	name: string;
	avatarHash: string;
}

// export interface UserWithAccessToken {
// 	accessToken: string;
// 	user: UserInfo;
// }

// export interface GroupInfo {
// 	id: string;
// 	name: string;
// 	adminId: string;
// }
