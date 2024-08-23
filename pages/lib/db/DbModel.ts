import { createId as cuid } from "@paralleldrive/cuid2";
import { Db, MongoClient } from "mongodb";

import { mapToAccount } from "./mapper";

import Result from "@/lib/Result";
import { Account, BaseAccountInfo, User } from "@/lib/schema";

export default class DbModel {
	private db: Db;
	private collection;

	public constructor(client: MongoClient) {
		this.db = client.db("schedule-manager");
		this.collection = {
			user: this.db.collection("user"),
			account: this.db.collection("account"),
			group: this.db.collection("group"),
			schedule: this.db.collection("schedule"),
		};
	}

	/**
	 * sign up if not registered yet.
	 * @param fetchedAccountInfo from external API
	 * @returns
	 */
	public async signIn(
		fetchedAccountInfo: BaseAccountInfo,
	): Promise<Result<null>> {
		try {
			const existingAccountWithId = await this.collection.account.findOne({
				id: fetchedAccountInfo.id,
			});
			if (existingAccountWithId) {
				const existingAccount = mapToAccount(existingAccountWithId);
				if (this.needUpdateAccount(fetchedAccountInfo, existingAccount)) {
					await this.updateAccount(fetchedAccountInfo, existingAccount);
				}
			} else {
				await this.signUp(fetchedAccountInfo);
			}
			return {
				statusCode: 200,
				data: null,
			};
		} catch (error) {
			return {
				statusCode: 500,
				data: null,
				error: `${error}`,
			};
		}
	}

	private async signUp(fetchedAccountInfo: BaseAccountInfo) {
		const account: Account = {
			...fetchedAccountInfo,
			userId: cuid(),
		};
		await this.collection.account.insertOne(account);

		const user: User = {
			id: account.userId,
			name: account.name,
			groupsId: [],
		};
		await this.collection.user.insertOne(user);
	}

	private async updateAccount(
		fetchedAccountInfo: BaseAccountInfo,
		existingAccount: Account,
	) {
		const updatedAccount: Account = {
			...fetchedAccountInfo,
			userId: existingAccount.userId,
		};
		await this.collection.account.updateOne(
			{ id: updatedAccount.id },
			{ $set: updatedAccount },
		);
	}

	private needUpdateAccount(
		account1: BaseAccountInfo,
		account2: BaseAccountInfo,
	): boolean {
		return (
			account1.id !== account2.id ||
			account1.name !== account2.name ||
			account1.avatarHash !== account2.avatarHash
		);
	}

	// public async fetchUserInfo(accountId: string): Promise<Result<UserInfo>> {
	// 	try {
	// 		const account = await this.collection.account.findOne({ id: accountId });
	// 		if (!account) {
	// 			return {
	// 				statusCode: 404,
	// 				payload: { error: "Not Found" },
	// 			};
	// 		}

	// 		const user = await this.collection.user.findOne({ id: account.userId });
	// 		if (!user) {
	// 			return {
	// 				statusCode: 500,
	// 				payload: { error: "Internal Server Error" },
	// 			};
	// 		}

	// 		const groups = user.groupsId.map((groupId: string) => {
	// 			const group = await this.collection.group.findOne({ id: groupId });
	// 			return {
	// 				id: groupId,
	// 				name: group?.name,
	// 				adminId: group?.adminId,
	// 			};
	// 		});

	// 		return {
	// 			statusCode: 200,
	// 			payload: {
	// 				id: user.id,
	// 				accountId,
	// 				name: user.name,
	// 				avatarHash: account.avatarHash,
	// 				groups,
	// 			},
	// 		};
	// 	} catch (error) {
	// 		return {
	// 			statusCode: 500,
	// 			payload: {
	// 				error: `${error}`,
	// 			},
	// 		};
	// 	}
	// }
}
