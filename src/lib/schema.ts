export interface UserInfo {
	id: string;
	accountId: string;
	name: string;
	avatarHash: string;
	groups: GroupInfo[];
}

export interface AccountInfo {
	id: string;
	name: string;
	avatarHash: string;
}

export interface UserWithAccessToken {
	accessToken: string;
	user: UserInfo;
}

export interface GroupInfo {
	id: string;
	name: string;
	adminId: string;
}
