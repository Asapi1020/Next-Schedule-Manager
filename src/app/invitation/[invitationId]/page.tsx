"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchInvitationGroup, fetchUserInfo } from "@/apiClient/get";
import { joinGroup } from "@/apiClient/post";
import { LoadingCircle } from "@/components/LoadingCircle";
import { LoginButton } from "@/components/LoginButton";
import { getAccessToken } from "@/lib/dataUtils";
import { BaseGroupInfo, UserProfile } from "@/lib/schema";
import { safeLoadParam } from "@/lib/utils";

const invitationPage = () => {
	const accessToken = getAccessToken();
	const invitationId = safeLoadParam("invitationId");
	const [groupInfo, setGroupInfo] = useState<BaseGroupInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		const checkAlreadyJoined = async (groupId: string): Promise<boolean> => {
			try {
				const response = await fetchUserInfo(accessToken);
				if (response.status !== 200) {
					return false;
				}

				const userProfile: UserProfile = await response.json();
				return userProfile.groups.some((group) => group.id === groupId);
			} catch (error) {
				console.error(error);
				return false;
			}
		};

		const fetchGroupId = async () => {
			setIsLoading(true);
			try {
				const response = await fetchInvitationGroup(invitationId);

				if (response.status === 200) {
					const fetchedGroupInfo = await response.json();
					setGroupInfo(fetchedGroupInfo);

					const bAlreadyJoined = await checkAlreadyJoined(fetchedGroupInfo.id);
					if (bAlreadyJoined) {
						router.push(`/group/${fetchedGroupInfo.id}`);
					}
				} else {
					const { error } = await response.json();
					console.error(error);
				}
			} catch (error) {
				setGroupInfo(null);
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchGroupId();
	}, []);

	if (isLoading) {
		return <LoadingCircle />;
	}

	if (!groupInfo) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-lg text-gray-700 mb-8">Error: Invalid invitation.</p>
			</div>
		);
	}

	const handleJoinGroupClick = async () => {
		try {
			const response = await joinGroup(accessToken, groupInfo.id);

			if (response.status === 200) {
				router.push(`/group/${groupInfo.id}`);
			} else {
				const { error } = await response.json();
				console.error(error);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-4xl font-bold mb-4">Join {groupInfo.name}!</h1>
			{accessToken ? (
				<button
					onClick={handleJoinGroupClick}
					className="discord-login-button flex items-center"
				>
					Join this group
				</button>
			) : (
				<LoginButton label="Login with Discord" invitationId={invitationId} />
			)}
		</div>
	);
};

export default invitationPage;
