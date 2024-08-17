import { NextApiRequest, NextApiResponse } from "next";

import ensureAuthorization from "../lib/ensureAuthorization";
import execGas from "../lib/gasApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { userId, groupName } = req.body;
	const addNewGroupResult = await execGas("addNewGroup", [userId, groupName]);
	if (addNewGroupResult.statusCode !== 200) {
		return res.status(addNewGroupResult.statusCode).json({
			error: addNewGroupResult.message,
		});
	}

	return res.status(200).json(addNewGroupResult.message);
}

export default ensureAuthorization(handler);
