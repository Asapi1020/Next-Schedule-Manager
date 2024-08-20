"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import GroupSection from "./GroupSection";
import ProfileSection from "./ProfileSection";

import { LoadingCircle } from "@/components/LoadingCircle";
import { fetchUserInfo } from "@/lib/fetch";
import { getAccessToken, useUserContext } from "@/lib/getAccessToken";
import { UserInfo } from "@/lib/schema";

const MyPage = () => {
	const [userInfo, setUserInfo] = useUserContext();
	const [loading, setLoading] = useState<boolean>(false);
	const accessToken = getAccessToken();

	const router = useRouter();

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			try {
				const response = await fetchUserInfo(accessToken);

				if (response.status === 200) {
					const newUserInfo: UserInfo = await response.json();
					setUserInfo(newUserInfo);
					return;
				} else {
					const { error } = await response.json();
					setUserInfo(null);
					router.push("/");
					console.error(error);
					return;
				}
			} finally {
				setLoading(false);
			}
		};

		if (!userInfo) {
			fetchUserData();
		}
	}, [accessToken]);

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
			<GroupSection accessToken={accessToken} userInfo={userInfo} />
		</div>
	);
};

export default MyPage;
