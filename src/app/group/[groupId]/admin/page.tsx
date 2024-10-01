"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { handleCopyLink } from "./handler";

import {
	fetchGroupInfo,
	fetchInvitations,
	fetchUserNames,
} from "@/apiClient/get";
import {
	changeGroupName,
	createInvitationLink,
	deleteGroup,
	discardInvitationLink,
	kickUser,
} from "@/apiClient/post";
import { LoadingCircle } from "@/components/LoadingCircle";
import SaveButton from "@/components/SaveButton";
import authEffect from "@/lib/authEffect";
import { getAccessToken, useUserContext } from "@/lib/dataUtils";
import { Group, User } from "@/lib/schema";
import { safeLoadParam } from "@/lib/utils";

const AdminPage = () => {
	const [userInfo, setUserInfo] = useUserContext();
	const [loading, setLoading] = useState<boolean>(false);
	const [groupInfo, setGroupInfo] = useState<Group | undefined>();
	const [members, setMembers] = useState<User[]>([]);
	const [isSavingName, setIsSavingName] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [isDeleted, setIsDeleted] = useState<boolean>(false);
	const [invitationIds, setInvitationIds] = useState<string[]>([]);

	const accessToken = getAccessToken();

	const router = useRouter();
	const groupId = safeLoadParam("groupId");

	authEffect(accessToken, setLoading, userInfo, setUserInfo);

	useEffect(() => {
		const fetchGroupData = async () => {
			setLoading(true);
			try {
				const fetchGroupInfoResponse = await fetchGroupInfo(groupId);

				if (fetchGroupInfoResponse.status !== 200) {
					const { error } = await fetchGroupInfoResponse.json();
					router.push("/");
					console.error(error);
					return;
				}
				const fetchedGroupInfo: Group = await fetchGroupInfoResponse.json();

				if (fetchedGroupInfo.adminId !== userInfo?.id) {
					router.push("/");
					console.error("You are not an admin");
					return;
				}

				const fetchUsersResponse = await fetchUserNames(
					accessToken,
					fetchedGroupInfo.usersId,
				);

				if (fetchUsersResponse.status !== 200) {
					const { error } = await fetchGroupInfoResponse.json();
					router.push("/");
					console.error(error);
					return;
				}
				const fetchedUsers: User[] = await fetchUsersResponse.json();

				const fetchInvitationsResponse = await fetchInvitations(
					accessToken,
					groupId,
				);

				if (fetchGroupInfoResponse.status !== 200) {
					const { error } = await fetchGroupInfoResponse.json();
					router.push("/");
					console.error(error);
					return;
				}
				const fetchedInvitations: string[] =
					await fetchInvitationsResponse.json();

				setMembers(fetchedUsers);
				setGroupInfo(fetchedGroupInfo);
				setInvitationIds(fetchedInvitations);
			} catch (error) {
				router.push("/");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchGroupData();
	}, [groupId]);

	if (loading || !groupInfo) {
		return (
			<div className="flex justify-center items-center container mx-auto p-4">
				<LoadingCircle />
				Loading...
			</div>
		);
	}

	if (!userInfo) {
		return (
			<div className="container mx-auto p-4">Failed to fetch user info</div>
		);
	}

	if (isDeleted) {
		return (
			<div className="container mx-auto p-4">
				This group is successfully deleted.
			</div>
		);
	}

	const handleGroupUpdate = async () => {
		try {
			setIsSavingName(true);
			const response = await changeGroupName(
				accessToken,
				groupInfo.id,
				groupInfo.name,
			);

			if (response.status !== 200) {
				const { error } = await response.json();
				alert(error);
				return;
			}

			const newGroupsInLocalStorage = userInfo.groups.map((group) => {
				if (group.id === groupInfo.id) {
					return {
						id: group.id,
						adminId: group.adminId,
						name: groupInfo.name,
					};
				}
				return group;
			});
			setUserInfo({
				...userInfo,
				groups: newGroupsInLocalStorage,
			});
		} catch (error) {
			console.error("Failed to update group profile:", error);
		} finally {
			setIsSavingName(false);
		}
	};

	const handleGroupDelete = async () => {
		const firstConfirm = window.confirm(
			"Are you sure you want to delete this group?",
		);
		if (!firstConfirm) {
			return;
		}

		const secondConfirm = window.confirm(
			"Are you REALLY sure you want to DELETE this group?",
		);
		if (!secondConfirm) {
			return;
		}

		try {
			setIsDeleting(true);
			const response = await deleteGroup(accessToken, groupInfo.id);

			if (response.status !== 200) {
				const { error } = await response.json();
				alert(error);
				return;
			}

			const newGroupsInLocalStorage = userInfo.groups.filter(
				(group) => group.id !== groupInfo.id,
			);
			setUserInfo({
				...userInfo,
				groups: newGroupsInLocalStorage,
			});

			setIsDeleted(true);
		} catch (error) {
			console.error("Failed to delete group:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleKickUser = async (userId: string) => {
		const confirmKick = window.confirm(
			"Are you sure you want to kick this user?",
		);
		if (!confirmKick) {
			return;
		}

		try {
			const response = await kickUser(accessToken, groupInfo.id, userId);

			if (response.status !== 200) {
				const { error } = await response.json();
				alert(error);
				return;
			}

			const newMembers = members.filter((member) => member.id !== userId);
			setMembers(newMembers);
		} catch (error) {
			console.error("Failed to kick user:", error);
		}
	};

	const handleCreateInviteLink = async () => {
		try {
			const response = await createInvitationLink(accessToken, groupInfo.id);

			if (response.status !== 200) {
				const { error } = await response.json();
				alert(error);
				return;
			}

			const { id: invitationId } = await response.json();
			setInvitationIds([...invitationIds, invitationId]);
		} catch (error) {
			console.error("Failed to create invite link:", error);
		}
	};

	const handleDiscardInviteLink = async (invitationId: string) => {
		const confirm = window.confirm(
			"Are you sure you want to discard this invitation?",
		);
		if (!confirm) {
			return;
		}

		try {
			const response = await discardInvitationLink(accessToken, invitationId);

			if (response.status !== 200) {
				const { error } = await response.json();
				alert(error);
				return;
			}

			const newInvitations = invitationIds.filter((id) => id !== invitationId);
			setInvitationIds(newInvitations);
		} catch (error) {
			console.error("Failed to discard invite link:", error);
		}
	};

	return (
		<div className="container mx-auto px-6 py-4">
			<h1 className="text-2xl mb-4">{groupInfo.name}: Admin Page</h1>

			{/* Group Profile Edit Section */}
			<h2 className="text-xl mr-2">Group Name</h2>
			<div className="mb-6 flex items-center">
				<input
					type="text"
					value={groupInfo.name}
					onChange={(event) =>
						setGroupInfo({
							...groupInfo,
							name: event.target.value,
						})
					}
					placeholder="Group Name"
					className="border p-2 mr-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-all duration-300"
				/>
				<SaveButton isSaving={isSavingName} onClick={handleGroupUpdate} />
			</div>

			{/* Participant Management Section */}
			<h2 className="text-xl mb-2">Group Members</h2>
			<div className="mb-6">
				<table className="table-auto w-full text-left">
					<thead>
						<tr className="border-b">
							<th className="px-4 py-2">ID</th>
							<th className="px-4 py-2">Name</th>
							<th className="px-4 py-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{members.map((member) => (
							<tr key={member.id}>
								<td className="px-4 py-2">{member.id}</td>
								<td className="px-4 py-2">{member.name}</td>
								<td className="px-4 py-2">
									<button
										onClick={() => handleKickUser(member.id)}
										className={`text-white py-2 px-4 rounded ${
											member.id === userInfo.id
												? "bg-gray-600 cursor-not-allowed"
												: "bg-red-500 hover:bg-red-600"
										}`}
										disabled={member.id === userInfo.id}
									>
										Kick
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Invite Link Management Section */}
			<div className="mb-6">
				<h2 className="text-xl mb-2">Invite Links</h2>
				<table className="table-auto w-full text-left mb-2">
					<thead>
						<tr className="border-b">
							<th className="px-4 py-2">ID</th>
							<th className="px-4 py-2">Action</th>
						</tr>
					</thead>
					{invitationIds.map((invitationId) => (
						<tr>
							<td className="px-4 py-2">{invitationId}</td>
							<td className="px-4 py-2">
								<button
									className="bg-gray-500 text-white p-2 mr-4 rounded hover:bg-gray-600"
									onClick={() => handleCopyLink(invitationId)}
								>
									Copy
								</button>
								<button
									onClick={() => handleDiscardInviteLink(invitationId)}
									className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
								>
									Discard
								</button>
							</td>
						</tr>
					))}
				</table>
				<button
					onClick={handleCreateInviteLink}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					🔗 Create Invite Link
				</button>
			</div>

			{/* Group Delete Section */}
			<div className="mt-6 mb-6">
				<button
					onClick={handleGroupDelete}
					disabled={isDeleting}
					className="bg-red-600 text-white p-2 rounded"
				>
					{isDeleting ? "Deleting..." : "Delete Group"}
				</button>
			</div>
		</div>
	);
};

export default AdminPage;
