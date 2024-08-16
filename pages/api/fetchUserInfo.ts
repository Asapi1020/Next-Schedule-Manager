import { NextApiRequest, NextApiResponse } from "next";

import ensureAuthorization from "../lib/ensureAuthorization";
import execGas from "../lib/gasApi";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
	accountId: string,
) {
	const fetchUserInfoResult = await execGas("fetchUserInfo", [accountId]);
	console.log(fetchUserInfoResult);
	if (fetchUserInfoResult.statusCode !== 200) {
		return res.status(fetchUserInfoResult.statusCode).json({
			error: fetchUserInfoResult.message,
		});
	}

	return res.status(200).json(fetchUserInfoResult.message);
}

export default ensureAuthorization(handler);
