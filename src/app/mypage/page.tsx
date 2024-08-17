"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import GroupSection from "./GroupSection";
import ProfileSection from "./ProfileSection";

import { LoadingCircle } from "@/components/LoadingCircle";
import { fetchUserInfo } from "@/lib/fetch";
import { UserInfo } from "@/lib/schema";

const MyPage = () => {
	const [user, setUser] = useState<UserInfo | null>(null);
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
					setUser(userInfo);
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

	if (!user) {
		return (
			<div className="container mx-auto p-4">Failed to fetch user info</div>
		);
	}

	return (
		<div className="container mx-auto px-6 py-4">
			<ProfileSection accessToken={accessToken} user={user} />
			<GroupSection accessToken={accessToken} user={user} />
		</div>
	);
};

export default MyPage;
