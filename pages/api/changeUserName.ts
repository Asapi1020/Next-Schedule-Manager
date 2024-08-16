import { NextApiRequest, NextApiResponse } from "next";

import ensureAuthorization from "../lib/ensureAuthorization";
import execGas from "../lib/gasApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { userId, newName } = req.body;
	const changeUserNameResult = await execGas("changeUserName", [
		userId,
		newName,
	]);
	if (changeUserNameResult.statusCode !== 200) {
		return res.status(changeUserNameResult.statusCode).json({
			error: changeUserNameResult.message,
		});
	}

	return res.status(200).json(changeUserNameResult.message);
}

export default ensureAuthorization(handler);
