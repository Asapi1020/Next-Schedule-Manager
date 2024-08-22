import config from "./gasConfig";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const apiUrl = `https://script.googleapis.com/v1/scripts/${config.scriptId}:run`;

interface TokenResponse {
	access_token: string;
}

function isTokenResponse(result: unknown): result is TokenResponse {
	return (
		typeof result === "object" && result !== null && "access_token" in result
	);
}

async function getAccessToken() {
	const data = {
		client_id: config.clientId,
		client_secret: config.clientSecret,
		refresh_token: config.refreshToken,
		grant_type: "refresh_token",
	};

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	const result = await response.json();

	if (isTokenResponse(result)) {
		return result.access_token;
	} else {
		throw new Error("Failed to obtain access token.");
	}
}

interface GasResponse {
	response: {
		result: {
			statusCode: number;
			message: string;
		};
	};
	error?: {
		message: string;
	};
}

// FIXME: change DB system
export default async function execGas(
	functionName: string,
	parameters?: string[],
): Promise<{ statusCode: number; message: string }> {
	return {
		statusCode: 200,
		message: "",
	};
	const accessToken = await getAccessToken();

	const requestData = JSON.stringify({
		function: functionName,
		parameters,
	});

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: requestData,
	};

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(apiUrl, options);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const responseData: GasResponse = await response.json();
	if (responseData.error) {
		return {
			statusCode: 500,
			message: responseData.error.message,
		};
	}

	return {
		statusCode: responseData.response.result.statusCode,
		message: responseData.response.result.message,
	};
}
