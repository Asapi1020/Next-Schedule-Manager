import { Document, WithId } from "mongodb";

import { Account } from "@/lib/schema";

export function mapToAccount(result: WithId<Document>): Account {
	return {
		id: result.id,
		name: result.name,
		avatarHash: result.avatarHash,
		userId: result.userId,
	};
}
