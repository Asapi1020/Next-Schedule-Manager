import { NextApiRequest, NextApiResponse } from "next";

import { fetchAccessToken, fetchAccountInfo } from "../../lib/discord/oauth";
import execGas from "../../lib/gasApi";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { code } = req.query;
	if (typeof code !== "string") {
		return res.status(400).json({ error: "Invalid code" });
	}

	const fetchAccessTokenResult = await fetchAccessToken(code);
	if (fetchAccessTokenResult.statusCode !== 200) {
		return res.status(fetchAccessTokenResult.statusCode).json({
			error: "Failed to fetch access token",
		});
	}

	const accessToken = fetchAccessTokenResult.payload?.accessToken as string;
	const fetchAccountInfoResult = await fetchAccountInfo(accessToken);
	if (fetchAccountInfoResult.statusCode !== 200) {
		return res.status(fetchAccountInfoResult.statusCode).json({
			error: "Failed to fetch account info",
		});
	}

	const signInResult = await execGas("signInWithDiscord", [
		JSON.stringify(fetchAccountInfoResult.payload),
	]);
	if (signInResult.statusCode !== 200) {
		return res.status(signInResult.statusCode).json({
			error: signInResult.message,
		});
	}

	return res.status(200).json({
		accessToken,
	});
}
