"use client";

import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import Calendar from "./calendar";

import { UserContext } from "@/components/DataProvider";
import { LoadingCircle } from "@/components/LoadingCircle";
import { fetchUserInfo } from "@/lib/fetch";
import { UserInfo } from "@/lib/schema";

const groupPage = () => {
	const userContext = useContext(UserContext);
	if (!userContext) {
		throw new Error("UserContext must be used within a UserProvider");
	}
	const { userInfo, setUserInfo } = userContext;
	console.log(userInfo);

	const [loading, setLoading] = useState<boolean>(false);

	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;

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

	// TODO: fetch group info

	return (
		<div className="container mx-auto px-6 py-4">
			<h1>GroupName</h1>
			<Calendar userInfo={userInfo}></Calendar>
		</div>
	);
};

export default groupPage;
