import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "@/pages/api/lib/db/DbModel";
import clientPromise from "@/pages/api/lib/db/mongo";
import ensureAuthorization from "@/pages/api/lib/ensureAuthorization";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
	accountId: string,
) {
	const { groupName } = req.body;
	const client = await clientPromise;
	const dbModel = new DbModel(client);

	const addNewGroupResult = await dbModel.addNewGroup(accountId, groupName);
	if (addNewGroupResult.statusCode !== 200) {
		return res.status(addNewGroupResult.statusCode).json({
			error: addNewGroupResult.error,
		});
	}

	return res.status(200).json(addNewGroupResult.data);
}

export default ensureAuthorization(handler);
