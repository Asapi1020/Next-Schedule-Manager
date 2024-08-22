"use client";

import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Calendar from "./calendar";

import { LoadingCircle } from "@/components/LoadingCircle";
import { getAccessToken, useUserContext } from "@/lib/dataUtils";
import { fetchUserInfo } from "@/lib/fetch";
import { UserInfo } from "@/lib/schema";

const groupPage = () => {
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

		if (!accessToken) {
			router.push("/");
			return;
		}

		if (!userInfo) {
			fetchUserData();
		}
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

	const params = useParams();
	const groupId = params?.groupId;
	const today = dayjs();

	// TODO: fetch group info

	return (
		<div className="container mx-auto px-6 py-4">
			<h1>GroupName</h1>
			<div className="calendar-container">
				<h2 className="text-xl font-bold mb-4 text-center">
					{today.format("MMMM YYYY")}
				</h2>
				<Calendar userInfo={userInfo} today={today} />
			</div>
		</div>
	);
};

export default groupPage;
