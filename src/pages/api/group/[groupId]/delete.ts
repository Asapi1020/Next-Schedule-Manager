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

	const deleteGroupResult = await dbModel.deleteGroup(accountId, groupId);
	if (deleteGroupResult.statusCode !== 200) {
		return res.status(deleteGroupResult.statusCode).json({
			error: deleteGroupResult.error,
		});
	}

	return res.status(200).json(deleteGroupResult.data);
}

export default ensureAuthorization(handler);
