import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "../lib/db/DbModel";
import clientPromise from "../lib/db/mongo";
import ensureAuthorization from "../lib/ensureAuthorization";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { userId, newName } = req.body;
	const client = await clientPromise;
	const dbModel = new DbModel(client);
	const changeUserNameResult = await dbModel.changeUserName(userId, newName);
	if (changeUserNameResult.statusCode !== 200) {
		return res.status(changeUserNameResult.statusCode).json({
			error: changeUserNameResult.error,
		});
	}

	return res.status(200).json(changeUserNameResult.data);
}

export default ensureAuthorization(handler);
