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
