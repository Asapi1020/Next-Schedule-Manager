import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "@/pages/api/lib/db/DbModel";
import clientPromise from "@/pages/api/lib/db/mongo";
import ensureAuthorization from "@/pages/api/lib/ensureAuthorization";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
	accountId: string,
) {
	const {
		query: { groupId, userId },
	} = req;
	const client = await clientPromise;
	const dbModel = new DbModel(client);

	if (typeof groupId !== "string" || typeof userId !== "string") {
		return res.status(400).json({ error: "Bad Request" });
	}

	const kickUserResult = await dbModel.kickUser(accountId, groupId, userId);
	if (kickUserResult.statusCode !== 200) {
		return res.status(kickUserResult.statusCode).json({
			error: kickUserResult.error,
		});
	}

	return res.status(200).json(kickUserResult.data);
}

export default ensureAuthorization(handler);
