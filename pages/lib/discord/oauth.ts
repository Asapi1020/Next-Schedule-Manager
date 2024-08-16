import Result from "@/lib/Result";
import { AccountInfo } from "@/lib/schema";

export async function fetchAccessToken(
	code: string,
): Promise<Result<{ accessToken: string }>> {
	const url = "https://discord.com/api/oauth2/token";

	const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
	const clientSecret = process.env.DISCORD_CLIENT_SECRET;
	const frontendAddress = process.env.NEXT_PUBLIC_FRONTEND_ADDRESS;

	if (!clientId || !clientSecret || !frontendAddress) {
		console.error("Error client id or client secret is not set properly");
		return {
			statusCode: 500,
			payload: null,
		};
	}

	const payload = new URLSearchParams({
		client_id: clientId,
		client_secret: clientSecret,
		code,
		grant_type: "authorization_code",
		redirect_uri: `${frontendAddress}/login`,
	}).toString();

	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: payload,
	};

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url, options);
	const data = await response.json();

	if (data.error) {
		return {
			statusCode: 401,
			payload: null,
		};
	}

	return {
		statusCode: 200,
		payload: {
			accessToken: data.access_token,
		},
	};
}

export async function fetchAccountInfo(
	accessToken: string,
): Promise<Result<AccountInfo>> {
	const url = "https://discord.com/api/users/@me";
	const options = {
		headers: { authorization: `Bearer ${accessToken}` },
	};

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url, options);
	const data = await response.json();

	if (!data.id) {
		const result = {
			statusCode: 401,
			payload: null,
		};
		return result;
	}

	return {
		statusCode: 200,
		payload: {
			id: data.id,
			name: data.global_name || data.username || "Unnamed User",
			avatarHash: data.avatar,
		},
	};
}
