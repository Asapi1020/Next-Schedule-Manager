import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "@/pages/api/lib/db/DbModel";
import clientPromise from "@/pages/api/lib/db/mongo";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const {
		query: { groupId },
	} = req;

	const client = await clientPromise;
	const dbModel = new DbModel(client);
	if (typeof groupId !== "string") {
		return res.status(400).json({ error: "Bad Request" });
	}

	const fetchGroupInfoResult = await dbModel.fetchGroupInfo(groupId);
	if (fetchGroupInfoResult.statusCode !== 200) {
		return res.status(fetchGroupInfoResult.statusCode).json({
			error: fetchGroupInfoResult.error,
		});
	}

	return res.status(200).json(fetchGroupInfoResult.data);
}
