import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "../lib/db/DbModel";
import clientPromise from "../lib/db/mongo";
import ensureAuthorization from "../lib/ensureAuthorization";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
	accountId: string,
) {
	const { groupId } = req.body;
	const client = await clientPromise;
	const dbModel = new DbModel(client);
	const createInvitationLinkResult = await dbModel.createInvitationLink(
		accountId,
		groupId,
	);
	if (createInvitationLinkResult.statusCode !== 200) {
		return res.status(createInvitationLinkResult.statusCode).json({
			error: createInvitationLinkResult.error,
		});
	}

	return res.status(200).json(createInvitationLinkResult.data);
}

export default ensureAuthorization(handler);
