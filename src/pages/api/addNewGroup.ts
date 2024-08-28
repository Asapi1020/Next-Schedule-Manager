import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "./lib/db/DbModel";
import clientPromise from "./lib/db/mongo";
import ensureAuthorization from "./lib/ensureAuthorization";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { userId, groupName } = req.body;
	const client = await clientPromise;
	const dbModel = new DbModel(client);
	const addNewGroupResult = await dbModel.addNewGroup(userId, groupName);
	if (addNewGroupResult.statusCode !== 200) {
		return res.status(addNewGroupResult.statusCode).json({
			error: addNewGroupResult.error,
		});
	}

	return res.status(200).json(addNewGroupResult.data);
}

export default ensureAuthorization(handler);
