import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "../lib/db/DbModel";
import clientPromise from "../lib/db/mongo";
import ensureAuthorization from "../lib/ensureAuthorization";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
	accountId: string,
) {
	const client = await clientPromise;
	const dbModel = new DbModel(client);
	const fetchUserInfoResult = await dbModel.fetchUserInfo(accountId);
	return res
		.status(fetchUserInfoResult.statusCode)
		.json(fetchUserInfoResult.payload);
}

export default ensureAuthorization(handler);
