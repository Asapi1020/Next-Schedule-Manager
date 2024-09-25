import { apiUrl } from "./utils";

async function get(url: URL, additionalHeaders?: HeadersInit) {
	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			...additionalHeaders,
		},
	});

	if (!response.ok) {
		const errorDetails = await response.json();
		throw new Error(
			`Failed to fetch: ${response.statusText} (${response.status}), details: ${JSON.stringify(errorDetails)}`,
		);
	}

	return response;
}

export async function signInWithDiscord(code: string) {
	const url = apiUrl("/login/discord");
	url.searchParams.append("code", code);
	return await get(url);
}

export async function fetchInvitationGroup(invitationId: string) {
	const url = apiUrl(`/invitation/${invitationId}/group`);
	return await get(url);
}

export async function fetchUserInfo(accessToken: string) {
	const url = apiUrl("/user/myProfile");
	return await get(url, { Authorization: `Bearer ${accessToken}` });
}

export async function fetchGroupSchedules(
	accessToken: string,
	groupId: string,
) {
	const url = apiUrl(`/group/${groupId}/schedules`);
	return await get(url, { Authorization: `Bearer ${accessToken}` });
}

export async function fetchUserNames(accessToken: string, usersId: string[]) {
	const url = apiUrl("/user");
	url.searchParams.append("ids", usersId.join(","));
	return await get(url, { Authorization: `Bearer ${accessToken}` });
}
