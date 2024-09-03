import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "@/pages/api/lib/db/DbModel";
import clientPromise from "@/pages/api/lib/db/mongo";
import ensureAuthorization from "@/pages/api/lib/ensureAuthorization";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
	accountId: string,
) {
	const { newName } = req.body;
	const client = await clientPromise;
	const dbModel = new DbModel(client);

	const changeUserNameResult = await dbModel.changeUserName(accountId, newName);
	if (changeUserNameResult.statusCode !== 200) {
		return res.status(changeUserNameResult.statusCode).json({
			error: changeUserNameResult.error,
		});
	}

	return res.status(200).json(changeUserNameResult.data);
}

export default ensureAuthorization(handler);
