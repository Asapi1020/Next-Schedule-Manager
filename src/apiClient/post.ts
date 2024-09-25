import { MonthlySchedule } from "../lib/schema";

import { apiUrl } from "./utils";

async function post(
	url: URL,
	accessToken: string,
	body?: object,
	additionalHeaders?: HeadersInit,
) {
	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			...additionalHeaders,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorDetails = await response.json();
		throw new Error(
			`Failed to fetch: ${response.statusText} (${response.status}), details: ${JSON.stringify(errorDetails)}`,
		);
	}

	return response;
}

export async function changeUserName(accessToken: string, newName: string) {
	const url = apiUrl("/user/changeName");
	return await post(url, accessToken, { newName });
}

export async function addNewGroup(accessToken: string, groupName: string) {
	const url = apiUrl("/group/new");
	return await post(url, accessToken, { groupName });
}

export async function saveSchedules(
	accessToken: string,
	groupId: string,
	schedules: MonthlySchedule[],
) {
	const url = apiUrl("/schedules");
	return await post(url, accessToken, { groupId, schedules });
}

export async function createInvitationLink(
	accessToken: string,
	groupId: string,
) {
	const url = apiUrl("/invitation/create");
	return await post(url, accessToken, { groupId });
}

export async function joinGroup(accessToken: string, groupId: string) {
	const url = apiUrl(`/group/${groupId}/join`);
	return await post(url, accessToken);
}
