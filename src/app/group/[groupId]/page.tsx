"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Calendar from "./calendar";

import { LoadingCircle } from "@/components/LoadingCircle";
import { fetchGroupSchedules } from "@/lib/apiClient";
import authEffect from "@/lib/authEffect";
import { getAccessToken, useUserContext } from "@/lib/dataUtils";
import { findMySchedule, fixSchedule } from "@/lib/scheduleUtils";
import { GroupWithSchedules } from "@/lib/schema";
import { safeLoadGroupId } from "@/lib/utils";

const groupPage = () => {
	const [userInfo, setUserInfo] = useUserContext();
	const [loading, setLoading] = useState<boolean>(false);
	const [deltaMonth, setDeltaMonth] = useState<number>(0);
	const [groupSchedules, setGroupSchedules] =
		useState<GroupWithSchedules | null>(null);
	const accessToken = getAccessToken();

	const router = useRouter();
	const groupId = safeLoadGroupId();

	authEffect(accessToken, setLoading, userInfo, setUserInfo);

	useEffect(() => {
		const fetchGroupSchedulesData = async () => {
			try {
				const response = await fetchGroupSchedules(accessToken, groupId);
				if (response.status === 200) {
					const fetchedData: GroupWithSchedules = await response.json();
					setGroupSchedules(fetchedData);
					return;
				} else {
					const { error } = await response.json();
					router.push("/");
					console.error(error);
					return;
				}
			} catch (error) {
				router.push("/");
				console.error(error);
			}
		};

		fetchGroupSchedulesData();
	}, []);

	if (loading || !groupSchedules) {
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

	const today = dayjs();
	const mySchedule = findMySchedule(groupSchedules, userInfo.id);
	const fixedSchedule = fixSchedule(mySchedule);

	return (
		<div className="container mx-auto px-6 py-4">
			<h1 className="font-bold">{groupSchedules.name}</h1>
			<div className="calendar-container">
				<div className="flex items-center justify-center mb-6">
					<button
						className="mr-4 text-center rounded px-4 py-1 text-white bg-gray-600 hover:bg-gray-700"
						onClick={() => setDeltaMonth(deltaMonth - 1)}
						disabled={deltaMonth <= 0}
					>
						◁
					</button>
					<h2 className="text-xl font-bold text-center">
						{today.add(deltaMonth, "month").format("YYYY/MM")}
					</h2>
					<button
						className="ml-4 text-center rounded px-4 py-1 text-white bg-gray-600 hover:bg-gray-700"
						onClick={() => setDeltaMonth(deltaMonth + 1)}
						disabled={deltaMonth >= 2}
					>
						▷
					</button>
				</div>
				<Calendar initialSchedules={fixedSchedule} deltaMonth={deltaMonth} />
			</div>
		</div>
	);
};

export default groupPage;
