"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";

import GroupSection from "./GroupSection";
import ProfileSection from "./ProfileSection";

import { UserContext } from "@/components/DataProvider";
import { LoadingCircle } from "@/components/LoadingCircle";
import { fetchUserInfo } from "@/lib/fetch";
import { UserInfo } from "@/lib/schema";

const MyPage = () => {
	const userContext = useContext(UserContext);
	if (!userContext) {
		throw new Error("UserContext must be used within a UserProvider");
	}
	const { userInfo, setUserInfo } = userContext;

	const [loading, setLoading] = useState<boolean>(true);

	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;

	const router = useRouter();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetchUserInfo(accessToken);

				if (response.status === 200) {
					const userInfo: UserInfo = await response.json();
					setUserInfo(userInfo);
					return;
				} else {
					const { error } = await response.json();
					router.push("/");
					throw new Error(error);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

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
