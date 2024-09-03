import { NextApiRequest, NextApiResponse } from "next";

import ensureAuthorization from "../lib/ensureAuthorization";

import DbModel from "@/pages/api/lib/db/DbModel";
import clientPromise from "@/pages/api/lib/db/mongo";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
	accountId: string,
) {
	const {
		query: { ids },
	} = req;

	const client = await clientPromise;
	const dbModel = new DbModel(client);
	if (typeof ids !== "string") {
		return res.status(400).json({ error: "Bad Request" });
	}

	const fetchNamesResult = await dbModel.fetchUsers(accountId, ids.split(","));
	if (fetchNamesResult.statusCode !== 200) {
		return res.status(fetchNamesResult.statusCode).json({
			error: fetchNamesResult.error,
		});
	}

	return res.status(200).json(fetchNamesResult.data);
}

export default ensureAuthorization(handler);
