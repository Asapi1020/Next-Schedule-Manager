"use client";

import dayjs from "dayjs";
import { useState } from "react";

import SaveButton from "@/components/SaveButton";
import { UserInfo } from "@/lib/schema";

interface CalendarTemplate {
	userInfo: UserInfo;
}

const Calendar: React.FC<CalendarTemplate> = (userInfo) => {
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	const today = dayjs();
	const startOfMonth = today.startOf("month");
	const endOfMonth = today.endOf("month");
	const daysInMonth = endOfMonth.date();

	const startDayOfWeek = startOfMonth.day();

	const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const initialSelections = Array.from({ length: daysInMonth }, () => "-");
	const [selections, setSelections] = useState<string[]>(initialSelections);

	const handleSelectChange = (dayIndex: number, value: string) => {
		const updatedSelections = [...selections];
		updatedSelections[dayIndex] =
			updatedSelections[dayIndex] === value ? "-" : value;
		setSelections(updatedSelections);
	};

	const handleSaveClick = () => {
		setIsSaving(true);
		try {
			console.log(userInfo);
			//await saveSchedules(accessToken, userInfo.id, selections);
			// TODO: setScheduleInfo
			setIsSaved(true);
		} catch (error) {
			console.error("Failed to save the new name:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="calendar-container">
			<h2 className="text-xl font-bold mb-4 text-center">
				{today.format("MMMM YYYY")}
			</h2>
			{/* Main */}
			<div className="grid grid-cols-7 gap-2">
				{daysOfWeek.map((day, i) => (
					<div
						key={i}
						className={`font-bold text-center rounded p-2 tex-white ${
							day === "Sun" ? "bg-red-600" : ""
						} ${
							day === "Sat" ? "bg-blue-600" : ""
						} ${day !== "Sun" && day !== "Sat" ? "bg-gray-600" : ""}
						}`}
					>
						{day}
					</div>
				))}
				{Array.from({ length: startDayOfWeek }).map((_, i) => (
					<div key={i} className="p-4"></div>
				))}
				{Array.from({ length: daysInMonth }).map((_, i) => {
					const date = startOfMonth.add(i, "day");
					return (
						<div key={i} className="day p-4 rounded bg-gray-800 text-center">
							<div>{date.format("D")}</div>
							<div className="mt-2 flex justify-center space-x-2">
								{["〇", "△", "×"].map((value) => (
									<button
										key={value}
										onClick={() => handleSelectChange(i, value)}
										className={`flex-grow border border-gray-500 rounded p-1  ${
											selections[i] === value ? "bg-blue-600" : "bg-gray-800"
										}`}
									>
										{value}
									</button>
								))}
							</div>
						</div>
					);
				})}
			</div>
			<div className="flex justify-center items-center container mx-auto p-4">
				<SaveButton isSaving={isSaving} onClick={handleSaveClick} />
			</div>
		</div>
	);
};

export default Calendar;
