import Result from "@/lib/Result";
import { BaseAccountInfo } from "@/lib/schema";

export async function fetchAccessToken(
	code: string,
): Promise<Result<{ accessToken: string }>> {
	const url = "https://discord.com/api/oauth2/token";

	const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
	const clientSecret = process.env.DISCORD_CLIENT_SECRET;
	const frontendAddress = process.env.NEXT_PUBLIC_FRONTEND_ADDRESS;

	if (!clientId || !clientSecret || !frontendAddress) {
		return {
			statusCode: 500,
			data: null,
			error: "Error client id or client secret is not set properly",
		};
	}

	const data = new URLSearchParams({
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
		body: data,
	};

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url, options);
	const result = await response.json();

	if (result.error) {
		return {
			statusCode: 401,
			data: null,
			error: `${result.error}`,
		};
	}

	return {
		statusCode: 200,
		data: {
			accessToken: result.access_token,
		},
	};
}

export async function fetchAccountInfo(
	accessToken: string,
): Promise<Result<BaseAccountInfo>> {
	const url = "https://discord.com/api/users/@me";
	const options = {
		headers: { authorization: `Bearer ${accessToken}` },
	};

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url, options);
	const result = await response.json();

	if (!result.id) {
		return {
			statusCode: 401,
			data: null,
			error: "Unauthorized",
		};
	}

	return {
		statusCode: 200,
		data: {
			id: result.id,
			name: result.global_name || result.username || "Unnamed User",
			avatarHash: result.avatar,
		},
	};
}
