"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoadingCircle } from "@/components/LoadingCircle";
import { LoginButton } from "@/components/LoginButton";
import {
	fetchInvitationDescription,
	fetchUserInfo,
	joinGroup,
} from "@/lib/apiClient";
import { getAccessToken } from "@/lib/dataUtils";
import { InvitationDescription, UserProfile } from "@/lib/schema";
import { safeLoadParam } from "@/lib/utils";

const invitationPage = () => {
	const accessToken = getAccessToken();
	const invitationId = safeLoadParam("invitationId");
	const [description, setDescription] = useState<InvitationDescription | null>(
		null,
	);
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
				const response = await fetchInvitationDescription(invitationId);

				if (response.status === 200) {
					const fetchedDescription = await response.json();
					setDescription(fetchedDescription);

					const bAlreadyJoined = await checkAlreadyJoined(
						fetchedDescription.groupId,
					);
					if (bAlreadyJoined) {
						router.push(`/group/${fetchedDescription.groupId}`);
					}
				} else {
					const { error } = await response.json();
					console.error(error);
				}
			} catch (error) {
				setDescription(null);
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

	if (!description) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-lg text-gray-700 mb-8">Error: Invalid invitation.</p>
			</div>
		);
	}

	const handleJoinGroupClick = async () => {
		try {
			const response = await joinGroup(accessToken, description.groupId);

			if (response.status === 200) {
				router.push(`/group/${description.groupId}`);
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
			<h1 className="text-4xl font-bold mb-4">Join {description.groupName}!</h1>
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
