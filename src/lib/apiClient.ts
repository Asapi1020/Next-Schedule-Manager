import { MonthlySchedule } from "./schema";

function apiUrl(endPoint: string): URL {
	return new URL("/api" + endPoint, process.env.NEXT_PUBLIC_FRONTEND_ADDRESS);
}

export async function signInWithDiscord(code: string) {
	const url = apiUrl("/login/discord");
	url.searchParams.append("code", code);

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response;
}

export async function fetchInvitationDescription(invitationId: string) {
	const url = apiUrl(`/invitation/${invitationId}/description`);

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response;
}

export async function fetchUserInfo(accessToken: string) {
	const url = apiUrl("/fetchUserInfo");

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return response;
}

export async function fetchGroupSchedules(
	accessToken: string,
	groupId: string,
) {
	const url = apiUrl(`/fetchGroupSchedules/${groupId}`);

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return response;
}

export async function fetchUserNames(accessToken: string, usersId: string[]) {
	const url = apiUrl("/user");
	url.searchParams.append("ids", usersId.join(","));

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return response;
}

// FIXME: quit receiving userId because client can cheat. Use fetched accountId instead
export async function changeUserName(
	accessToken: string,
	userId: string,
	newName: string,
) {
	const url = apiUrl("/changeUserName");

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			userId,
			newName,
		}),
	});

	return response;
}

export async function addNewGroup(
	accessToken: string,
	userId: string,
	groupName: string,
) {
	const url = apiUrl("/addNewGroup");

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			userId,
			groupName,
		}),
	});

	return response;
}

export async function saveSchedules(
	accessToken: string,
	groupId: string,
	schedules: MonthlySchedule[],
) {
	const url = apiUrl("/saveSchedules");

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			groupId,
			schedules,
		}),
	});

	return response;
}

export async function createInvitationLink(
	accessToken: string,
	groupId: string,
) {
	const url = apiUrl("/invitation/create");

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			groupId,
		}),
	});

	return response;
}

export async function joinGroup(accessToken: string, groupId: string) {
	const url = apiUrl(`/group/${groupId}/join`);

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.toString(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return response;
}
