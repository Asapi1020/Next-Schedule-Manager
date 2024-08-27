import { Document, WithId } from "mongodb";

import { Account, BaseGroupInfo, BaseScheduleInfo, Group } from "@/lib/schema";

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

export function ensureGroup(group: Group): Group {
	return {
		id: group.id,
		name: group.name,
		adminId: group.adminId,
		usersId: group.usersId,
	};
}
