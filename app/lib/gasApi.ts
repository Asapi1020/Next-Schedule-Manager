import config from "./gasConfig";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const apiUrl = `https://script.googleapis.com/v1/scripts/${config.scriptId}:run`;

export default class GasApi {
	private async getAccessToken() {
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

		if (
			typeof result === "object" &&
			result !== null &&
			"access_token" in result
		) {
			const { access_token } = result as { access_token: string };
			return access_token;
		} else {
			throw new Error("Failed to obtain access token.");
		}
	}

	public async execGas(functionName: string, parameters?: string[]) {
		const accessToken = await this.getAccessToken();

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

		const responseData = await response.json();

		return responseData;
	}
}
