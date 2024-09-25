import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "../../lib/db/DbModel";
import clientPromise from "../../lib/db/mongo";
import ensureAuthorization from "../../lib/ensureAuthorization";

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

	const saveSchedulesResult = await dbModel.fetchGroupSchedules(
		accountId,
		groupId,
	);
	if (saveSchedulesResult.statusCode !== 200) {
		return res.status(saveSchedulesResult.statusCode).json({
			error: saveSchedulesResult.error,
		});
	}

	return res.status(200).json(saveSchedulesResult.data);
}

export default ensureAuthorization(handler);
