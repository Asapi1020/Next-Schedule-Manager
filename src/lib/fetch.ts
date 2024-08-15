const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_ADDRESS + "/api";

export async function signInWithDiscord(code: string) {
	const url = new URL("/login/discord", baseUrl);
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
