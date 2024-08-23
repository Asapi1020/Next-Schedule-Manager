import { NextApiRequest, NextApiResponse } from "next";

import { fetchAccountInfo } from "./discord/oauth";

export default function ensureAuthorization(
	handler: (
		req: NextApiRequest,
		res: NextApiResponse,
		accountId: string,
	) => unknown | Promise<void>,
) {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const authHeader = req.headers.authorization;
		const authPrefix = "Bearer ";

		if (!authHeader || !authHeader.startsWith(authPrefix)) {
			return res.status(401).json({
				error: "Unauthorized",
			});
		}

		const accessToken = authHeader.split(authPrefix)[1];
		const fetchAccountInfoResult = await fetchAccountInfo(accessToken);
		if (fetchAccountInfoResult.statusCode !== 200) {
			return res.status(fetchAccountInfoResult.statusCode).json({
				error: "Unauthorized",
			});
		}

		const accountId = fetchAccountInfoResult.data?.id as string;
		return handler(req, res, accountId);
	};
}
