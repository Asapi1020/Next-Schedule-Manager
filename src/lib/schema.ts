/**
 * simple schema for backend
 */
// to login via API
export interface BaseAccountInfo {
	id: string;
	name: string;
	avatarHash: string;
}
// to fetch group info without user info
export interface BaseGroupInfo {
	id: string;
	name: string;
	adminId: string;
}

export interface BaseScheduleInfo {
	userId: string;
	schedules: MonthlySchedule[];
}
// each user possess array of this for each group
export interface MonthlySchedule {
	year: number;
	month: number; // 0~11
	availabilities: Availability[];
}

export type Availability = "〇" | "△" | "×" | "-";

/**
 * strict schema mainly for db
 */
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

export interface Schedule extends BaseScheduleInfo {
	groupId: string;
}

export interface Invitation {
	id: string;
	groupId: string;
	// expireDate
}

/**
 * combined complicated schema
 */
// to display user myPage
export interface UserProfile {
	id: string;
	accountId: string;
	name: string;
	avatarHash: string;
	groups: BaseGroupInfo[];
}
// to display group schedule page
export interface GroupWithSchedules extends Group {
	scheduleData: BaseScheduleInfo[];
}

// to display what this invitation is
export interface InvitationDescription {
	groupId: string;
	groupName: string;
}
