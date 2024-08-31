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
		query: { groupId },
	} = req;
	const client = await clientPromise;
	const dbModel = new DbModel(client);
	if (typeof groupId !== "string") {
		return res.status(400).json({ error: "Bad Request" });
	}

	const joinGroupResult = await dbModel.joinGroup(accountId, groupId);
	if (joinGroupResult.statusCode !== 200) {
		console.log(joinGroupResult.error);
		return res.status(joinGroupResult.statusCode).json({
			error: joinGroupResult.error,
		});
	}
	return res.status(200).json(joinGroupResult.data);
}

export default ensureAuthorization(handler);
