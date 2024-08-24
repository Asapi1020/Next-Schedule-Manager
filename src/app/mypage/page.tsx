"use client";

import { useState } from "react";

import GroupSection from "./GroupSection";
import ProfileSection from "./ProfileSection";

import { LoadingCircle } from "@/components/LoadingCircle";
import authEffect from "@/lib/authEffect";
import { getAccessToken, useUserContext } from "@/lib/dataUtils";

const MyPage = () => {
	const [userInfo, setUserInfo] = useUserContext();
	const [loading, setLoading] = useState<boolean>(false);
	const accessToken = getAccessToken();

	authEffect(accessToken, setLoading, userInfo, setUserInfo);

	if (loading) {
		return (
			<div className="flex justify-center items-center container mx-auto p-4">
				<LoadingCircle />
				Loading...
			</div>
		);
	}

	if (!userInfo) {
		return (
			<div className="container mx-auto p-4">Failed to fetch Info info</div>
		);
	}

	return (
		<div className="container mx-auto px-6 py-4">
			<ProfileSection
				accessToken={accessToken}
				userInfo={userInfo}
				setUserInfo={setUserInfo}
			/>
			<GroupSection
				accessToken={accessToken}
				userInfo={userInfo}
				setUserInfo={setUserInfo}
			/>
		</div>
	);
};

export default MyPage;
