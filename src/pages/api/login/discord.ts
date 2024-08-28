import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "../lib/db/DbModel";
import clientPromise from "../lib/db/mongo";
import { fetchAccessToken, fetchAccountInfo } from "../lib/discord/oauth";

import { BaseAccountInfo } from "@/lib/schema";

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
		return res
			.status(fetchAccessTokenResult.statusCode)
			.json({ error: fetchAccessTokenResult.error });
	}

	const accessToken = fetchAccessTokenResult.data?.accessToken as string;
	const fetchAccountInfoResult = await fetchAccountInfo(accessToken);
	if (fetchAccountInfoResult.statusCode !== 200) {
		return res.status(fetchAccountInfoResult.statusCode).json({
			error: fetchAccountInfoResult.error,
		});
	}

	const client = await clientPromise;
	const dbModel = new DbModel(client);
	const signInResult = await dbModel.signIn(
		fetchAccountInfoResult.data as BaseAccountInfo,
	);
	if (signInResult.statusCode !== 200) {
		return res.status(signInResult.statusCode).json({
			error: signInResult.error,
		});
	}

	return res.status(200).json({
		accessToken,
	});
}
