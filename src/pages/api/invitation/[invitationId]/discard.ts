import { NextApiRequest, NextApiResponse } from "next";

import DbModel from "../../lib/db/DbModel";
import clientPromise from "../../lib/db/mongo";
import ensureAuthorization from "../../lib/ensureAuthorization";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
	accountId: string,
) {
	const {
		query: { invitationId },
	} = req;
	const client = await clientPromise;
	const dbModel = new DbModel(client);
	if (typeof invitationId !== "string") {
		return res.status(400).json({ error: "Bad Request" });
	}

	const deleteInvitationResult = await dbModel.deleteInvitation(
		accountId,
		invitationId,
	);
	if (deleteInvitationResult.statusCode !== 200) {
		return res.status(deleteInvitationResult.statusCode).json({
			error: deleteInvitationResult.error,
		});
	}

	return res.status(200).json(deleteInvitationResult.data);
}

export default ensureAuthorization(handler);
