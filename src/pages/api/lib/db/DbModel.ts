import { createId as cuid } from "@paralleldrive/cuid2";
import { Db, MongoClient, PushOperator } from "mongodb";

import {
	ensureGroup,
	mapToAccount,
	mapToBaseGroupsInfo,
	mapToBaseSchedulesInfo,
	mapToUser,
} from "./mapper";

import Result from "@/lib/Result";
import {
	Account,
	BaseAccountInfo,
	Group,
	GroupWithSchedules,
	Invitation,
	InvitationDescription,
	MonthlySchedule,
	Schedule,
	User,
	UserProfile,
} from "@/lib/schema";

export default class DbModel {
	private db: Db;
	private collection;

	public constructor(client: MongoClient) {
		this.db = client.db(process.env.DB_NAME);
		this.collection = {
			user: this.db.collection("user"),
			account: this.db.collection("account"),
			group: this.db.collection("group"),
			schedule: this.db.collection("schedule"),
			invitation: this.db.collection("invitation"),
		};
	}

	/**
	 * sign up if not registered yet.
	 * @param fetchedAccountInfo from external API
	 * @returns
	 */
	public async signIn(fetchedAccountInfo: BaseAccountInfo): Promise<Result> {
		try {
			const existingAccountAny = await this.collection.account.findOne({
				id: fetchedAccountInfo.id,
			});
			if (existingAccountAny) {
				const existingAccount = mapToAccount(existingAccountAny);
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

	public async fetchUserInfo(accountId: string): Promise<Result<UserProfile>> {
		try {
			const account = await this.collection.account.findOne({ id: accountId });
			if (!account) {
				return {
					statusCode: 404,
					data: null,
					error: "Not Found",
				};
			}

			const user = await this.collection.user.findOne({ id: account.userId });
			if (!user) {
				return {
					statusCode: 500,
					data: null,
					error: "Internal Server Error",
				};
			}

			const groups = await this.collection.group
				.find({
					id: { $in: user.groupsId },
				})
				.toArray();
			const baseGroupsInfo = mapToBaseGroupsInfo(groups);

			return {
				statusCode: 200,
				data: {
					id: user.id,
					accountId,
					name: user.name,
					avatarHash: account.avatarHash,
					groups: baseGroupsInfo,
				},
			};
		} catch (error) {
			return {
				statusCode: 500,
				data: null,
				error: `${error}`,
			};
		}
	}

	public async changeUserName(id: string, name: string): Promise<Result> {
		try {
			await this.collection.user.updateOne({ id }, { $set: { name } });
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

	public async addNewGroup(
		adminId: string,
		name: string,
	): Promise<Result<Group>> {
		try {
			const group: Group = {
				id: cuid(),
				name,
				adminId,
				usersId: [adminId],
			};
			await this.collection.group.insertOne(group);

			const pushOperator: PushOperator<Document> = { groupsId: group.id };
			await this.collection.user.updateOne(
				{ id: adminId },
				{ $push: pushOperator },
			);

			return {
				statusCode: 200,
				data: ensureGroup(group),
			};
		} catch (error) {
			return {
				statusCode: 500,
				data: null,
				error: `${error}`,
			};
		}
	}

	public async saveSchedules(
		accountId: string,
		groupId: string,
		schedules: MonthlySchedule[],
	): Promise<Result> {
		try {
			const account = await this.collection.account.findOne({ id: accountId });
			if (!account) {
				return {
					statusCode: 400,
					data: null,
					error: "Account not found",
				};
			}

			const user = await this.collection.user.findOne({ id: account.userId });
			if (!user) {
				return {
					statusCode: 400,
					data: null,
					error: "User not found",
				};
			}

			const scheduleData = await this.collection.schedule.findOne({
				userId: user.id,
				groupId,
			});

			if (scheduleData) {
				await this.collection.schedule.updateOne(
					{ userId: scheduleData.userId, groupId: scheduleData.groupId },
					{ $set: { schedules } },
				);
			} else {
				const newScheduleData: Schedule = {
					userId: user.id,
					groupId,
					schedules,
				};
				await this.collection.schedule.insertOne(newScheduleData);
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

	public async fetchGroupSchedules(
		accountId: string,
		groupId: string,
	): Promise<Result<GroupWithSchedules>> {
		try {
			const account = await this.collection.account.findOne({ id: accountId });
			if (!account) {
				return {
					statusCode: 400,
					data: null,
					error: "Account not found",
				};
			}

			const user = await this.collection.user.findOne({ id: account.userId });
			if (!user) {
				return {
					statusCode: 400,
					data: null,
					error: "User not found",
				};
			}

			if (!user.groupsId.includes(groupId)) {
				return {
					statusCode: 400,
					data: null,
					error: "User does not belong to the group",
				};
			}

			const group = await this.collection.group.findOne({ id: groupId });
			if (!group) {
				return {
					statusCode: 400,
					data: null,
					error: "Group not found",
				};
			}

			const schedule = await this.collection.schedule
				.find({ groupId: group.id })
				.toArray();
			return {
				statusCode: 200,
				data: {
					id: group.id,
					name: group.name,
					adminId: group.adminId,
					usersId: group.usersId,
					scheduleData: mapToBaseSchedulesInfo(schedule),
				},
			};
		} catch (error) {
			return {
				statusCode: 500,
				data: null,
				error: `${error}`,
			};
		}
	}

	public async createInvitationLink(
		accountId: string,
		groupId: string,
	): Promise<Result<{ id: string }>> {
		try {
			const account = await this.collection.account.findOne({ id: accountId });
			if (!account) {
				return {
					statusCode: 400,
					data: null,
					error: "Account not found",
				};
			}

			const user = await this.collection.user.findOne({ id: account.userId });
			if (!user) {
				return {
					statusCode: 400,
					data: null,
					error: "User not found",
				};
			}

			const group = await this.collection.group.findOne({ id: groupId });
			if (!group) {
				return {
					statusCode: 400,
					data: null,
					error: "Group not found",
				};
			}

			if (group.adminId !== user.id) {
				return {
					statusCode: 401,
					data: null,
					error: "Unauthorized",
				};
			}

			const invitation: Invitation = {
				id: cuid(),
				groupId,
			};
			await this.collection.invitation.insertOne(invitation);

			return {
				statusCode: 200,
				data: { id: invitation.id },
			};
		} catch (error) {
			return {
				statusCode: 500,
				data: null,
				error: `${error}`,
			};
		}
	}

	public async fetchInvitationDescription(
		invitationId: string,
	): Promise<Result<InvitationDescription>> {
		try {
			const invitation = await this.collection.invitation.findOne({
				id: invitationId,
			});
			const groupId = invitation?.groupId;
			if (!groupId) {
				return {
					statusCode: 400,
					data: null,
					error: "Group not found",
				};
			}

			const group = await this.collection.group.findOne({ id: groupId });
			if (!group) {
				return {
					statusCode: 400,
					data: null,
					error: "Group not found",
				};
			}

			return {
				statusCode: 200,
				data: {
					groupId,
					groupName: group.name,
				},
			};
		} catch (error) {
			return {
				statusCode: 500,
				data: null,
				error: `${error}`,
			};
		}
	}

	public async joinGroup(accountId: string, groupId: string): Promise<Result> {
		try {
			const account = await this.collection.account.findOne({ id: accountId });
			if (!account) {
				return {
					statusCode: 400,
					data: null,
					error: "Account not found",
				};
			}

			const user = await this.collection.user.findOne({
				id: account.userId,
			});
			if (!user) {
				return {
					statusCode: 400,
					data: null,
					error: "User not found",
				};
			}

			const pushGroupIntoUser: PushOperator<Document> = { groupsId: groupId };
			await this.collection.user.updateOne(
				{ id: user.id },
				{ $push: pushGroupIntoUser },
			);

			const pushUserIntoGroup: PushOperator<Document> = { usersId: user.id };
			await this.collection.group.updateOne(
				{ id: groupId },
				{ $push: pushUserIntoGroup },
			);

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

	public async fetchUserNames(
		accountId: string,
		ids: string[],
	): Promise<Result<User[]>> {
		try {
			const account = await this.collection.account.findOne({ id: accountId });
			if (!account) {
				return {
					statusCode: 400,
					data: null,
					error: "Account not found",
				};
			}

			const user = await this.collection.user.findOne({
				id: account.userId,
			});
			if (!user) {
				return {
					statusCode: 400,
					data: null,
					error: "User not found",
				};
			}

			const usersWithObjectId = await this.collection.user
				.find({ id: { $in: ids } })
				.toArray();
			const users: User[] = mapToUser(usersWithObjectId, true);

			return {
				statusCode: 200,
				data: users,
			};
		} catch (error) {
			return {
				statusCode: 500,
				data: null,
				error: `${error}`,
			};
		}
	}
}
