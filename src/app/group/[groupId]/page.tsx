"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Calendar from "./calendar";
import Table from "./table";

import { LoadingCircle } from "@/components/LoadingCircle";
import { createInvitationLink, fetchGroupSchedules } from "@/lib/apiClient";
import authEffect from "@/lib/authEffect";
import { getAccessToken, useUserContext } from "@/lib/dataUtils";
import {
	createDefaultAvailability,
	findMySchedule,
	findSchedule,
	fixSchedules,
} from "@/lib/scheduleUtils";
import {
	Availability,
	GroupWithSchedules,
	MonthlySchedule,
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
						scheduleData: fixSchedules(fetchedData.scheduleData),
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
		const targetToday = dayjs().add(deltaMonth, "month");
		const targetSelections = findMonthlySchedule(
			schedules,
			targetToday.year(),
			targetToday.month(),
		);
		setSelections(targetSelections);
	}, [groupSchedules, deltaMonth]);

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

	const handleCopyLink = async () => {
		try {
			const response = await createInvitationLink(
				accessToken,
				groupSchedules.id,
			);
			if (response.status === 200) {
				const { id: invitationId } = await response.json();
				const link = `${process.env.NEXT_PUBLIC_FRONTEND_ADDRESS}/invitation/${invitationId}`;
				// eslint-disable-next-line n/no-unsupported-features/node-builtins
				navigator.clipboard
					.writeText(link)
					.then(() => {
						alert("Link copied to clipboard!");
					})
					.catch((error) => {
						console.error("Failed to copy:", error);
					});
				return;
			} else {
				const { error } = await response.json();
				alert(error);
				return;
			}
		} catch (error) {
			alert(error);
		}
	};

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
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						onClick={handleCopyLink}
					>
						🔗 Invitation Link
					</button>
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
						scheduleData={groupSchedules.scheduleData}
						deltaMonth={deltaMonth}
					></Table>
				)}
			</div>
		</div>
	);
};

export default groupPage;

const findMonthlySchedule = (
	schedules: MonthlySchedule[],
	year: number,
	month: number,
): Availability[] => {
	const targetSchedule = findSchedule(schedules, year, month);

	return (
		targetSchedule?.availabilities || createDefaultAvailability(year, month)
	);
};
