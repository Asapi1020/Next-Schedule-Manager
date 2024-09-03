import { Document, WithId } from "mongodb";

import {
	Account,
	BaseGroupInfo,
	BaseScheduleInfo,
	Group,
	User,
} from "@/lib/schema";

export function mapToAccount(result: WithId<Document>): Account {
	return {
		id: result.id,
		name: result.name,
		avatarHash: result.avatarHash,
		userId: result.userId,
	};
}

export function mapToBaseGroupsInfo(
	results: WithId<Document>[],
): BaseGroupInfo[] {
	return results.map((result) => {
		return {
			id: result.id,
			name: result.name,
			adminId: result.adminId,
		};
	});
}

export function mapToBaseSchedulesInfo(
	results: WithId<Document>[],
): BaseScheduleInfo[] {
	return results.map((result) => {
		return {
			userId: result.userId,
			schedules: result.schedules,
		};
	});
}

export function mapToUsers(
	results: WithId<Document>[],
	withoutGroupsId = false,
): User[] {
	return results.map((result) => mapToUser(result, withoutGroupsId));
}

export function mapToUser(
	result: WithId<Document>,
	withoutGroupsId = false,
): User {
	return {
		id: result.id,
		name: result.name,
		groupsId: withoutGroupsId ? [] : result.groupsId,
	};
}

export function ensureGroup(group: Group): Group {
	return {
		id: group.id,
		name: group.name,
		adminId: group.adminId,
		usersId: group.usersId,
	};
}
