"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Calendar from "./calendar";
import { findMonthlySchedule, findMySchedule, fixSchedules } from "./handler";
import Table from "./table";

import { fetchGroupSchedules, fetchUserNames } from "@/apiClient/get";
import { LoadingCircle } from "@/components/LoadingCircle";
import authEffect from "@/lib/authEffect";
import { getAccessToken, useUserContext } from "@/lib/dataUtils";
import {
	Availability,
	GroupWithSchedules,
	MonthlySchedule,
	User,
} from "@/lib/schema";
import { safeLoadParam } from "@/lib/utils";

const groupPage = () => {
	const [userInfo, setUserInfo] = useUserContext();
	const [loading, setLoading] = useState<boolean>(false);
	const [deltaMonth, setDeltaMonth] = useState<number>(0);
	const [groupSchedules, setGroupSchedules] =
		useState<GroupWithSchedules | null>(null);
	const [isCalendarView, setIsCalendarView] = useState<boolean>(true);

	const [schedules, setSchedules] = useState<MonthlySchedule[]>([]);
	const [selections, setSelections] = useState<Availability[]>([]);
	const [users, setUsers] = useState<User[]>([]);

	const accessToken = getAccessToken();

	const router = useRouter();
	const groupId = safeLoadParam("groupId");
	const today = dayjs();

	authEffect(accessToken, setLoading, userInfo, setUserInfo);

	useEffect(() => {
		const fetchGroupSchedulesData = async () => {
			try {
				const response = await fetchGroupSchedules(accessToken, groupId);
				if (response.status === 200) {
					const fetchedData: GroupWithSchedules = await response.json();
					const fixedData: GroupWithSchedules = {
						...fetchedData,
						scheduleData: fixSchedules(fetchedData.scheduleData, userInfo?.id),
					};
					setGroupSchedules(fixedData);

					if (userInfo) {
						const mySchedule = findMySchedule(fixedData, userInfo.id);
						setSchedules(mySchedule);
					}
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

	useEffect(() => {
		const fetchUserNamesData = async () => {
			try {
				if (!groupSchedules) {
					return;
				}

				const usersId = groupSchedules.scheduleData.map(
					(datum) => datum.userId,
				);
				const response = await fetchUserNames(accessToken, usersId);

				if (response.status === 200) {
					const fetchedUsers = await response.json();
					setUsers(fetchedUsers);
					return;
				} else {
					const { error } = await response.json();
					console.error(error);
					return;
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchUserNamesData();
	}, [groupSchedules]);

	useEffect(() => {
		const targetSelections = findMonthlySchedule(
			schedules,
			today.add(deltaMonth, "month").year(),
			today.add(deltaMonth, "month").month(),
		);
		setSelections(targetSelections);
	}, [groupSchedules, deltaMonth]);

	useEffect(() => {
		if (!groupSchedules || !userInfo) {
			return;
		}

		if (!userInfo.groups.some((group) => group.id === groupSchedules.id)) {
			const newUserInfo = { ...userInfo };
			newUserInfo.groups.push({
				id: groupSchedules.id,
				name: groupSchedules.name,
				adminId: groupSchedules.adminId,
			});
			setUserInfo(newUserInfo);
		}
	}, [groupSchedules, userInfo]);

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

	const toggleViewMode = () => {
		setIsCalendarView(!isCalendarView);
	};

	return (
		<div className="container mx-auto px-6 py-4">
			<div className="flex items-center justify-between mb-1">
				<div>
					<h1 className="font-bold">{groupSchedules.name}</h1>
					<div className="mt-4">
						<button
							className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 border"
							onClick={toggleViewMode}
						>
							{isCalendarView ? "Table view" : "Calendar view"}
						</button>
					</div>
				</div>
				{groupSchedules.adminId === userInfo.id && (
					<a
						href={`/group/${groupId}/admin`}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					>
						Admin Page
					</a>
				)}
			</div>

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
				{isCalendarView ? (
					<Calendar
						deltaMonth={deltaMonth}
						selectionState={[selections, setSelections]}
						schedulesState={[schedules, setSchedules]}
					/>
				) : (
					<Table
						userId={userInfo.id}
						scheduleData={groupSchedules.scheduleData}
						selections={selections}
						deltaMonth={deltaMonth}
						users={users}
					></Table>
				)}
			</div>
		</div>
	);
};

export default groupPage;
