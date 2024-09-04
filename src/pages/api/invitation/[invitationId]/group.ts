import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "@/pages/api/lib/db/DbModel";
import clientPromise from "@/pages/api/lib/db/mongo";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const {
		query: { invitationId },
	} = req;

	const client = await clientPromise;
	const dbModel = new DbModel(client);
	if (typeof invitationId !== "string") {
		return res.status(400).json({ error: "Bad Request" });
	}

	const fetchIdResult = await dbModel.fetchInvitationGroup(invitationId);
	if (fetchIdResult.statusCode !== 200) {
		return res.status(fetchIdResult.statusCode).json({
			error: fetchIdResult.error,
		});
	}

	return res.status(200).json(fetchIdResult.data);
}
