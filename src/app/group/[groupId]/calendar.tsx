"use client";

import dayjs from "dayjs";
import { useState } from "react";

import PlayButton from "@/components/PlayButton";
import SaveButton from "@/components/SaveButton";
import { saveSchedules } from "@/lib/apiClient";
import { getAccessToken } from "@/lib/dataUtils";
import { Availability, MonthlySchedule } from "@/lib/schema";
import { safeLoadGroupId } from "@/lib/utils";

interface CalendarTemplate {
	schedules: MonthlySchedule[] | undefined;
	deltaMonth: number;
}

const Calendar: React.FC<CalendarTemplate> = ({ schedules, deltaMonth }) => {
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [bulkDay, setBulkDay] = useState<string>("-");
	const [bulkAvailability, setBulkAvailability] = useState<string>("〇");
	const accessToken = getAccessToken();

	const today = dayjs().add(deltaMonth, "month");
	const startOfMonth = today.startOf("month");
	const endOfMonth = today.endOf("month");
	const daysInMonth = endOfMonth.date();
	const startDayOfWeek = startOfMonth.day();

	const fullNameDaysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const daysOfWeek = fullNameDaysOfWeek.map((day) => {
		return day.slice(0, 3);
	});
	const availabilities = ["〇", "△", "×"];

	const setupSelections = () => {
		if (schedules) {
			return (
				findMonthlySchedule(schedules, today.year(), today.month()) ??
				Array.from({ length: daysInMonth }, () => "-")
			);
		}
		return Array.from({ length: daysInMonth }, () => "-");
	};
	const initialSelections = setupSelections();
	const [selections, setSelections] = useState<string[]>(initialSelections);

	const handleSelectChange = (dayIndex: number, value: string) => {
		const updatedSelections = [...selections];
		updatedSelections[dayIndex] =
			updatedSelections[dayIndex] === value ? "-" : value;
		setSelections(updatedSelections);
	};

	const handleSaveClick = async () => {
		setIsSaving(true);
		try {
			const groupId = safeLoadGroupId();
			await saveSchedules(accessToken, groupId, selections);
			// TODO: setScheduleInfo
			setIsSaved(true);
		} catch (error) {
			console.error("Failed to save the new name:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleBulkApply = (value: string) => {
		const updatedSelections = selections.map((_, index) => {
			const dayOfWeek = (startDayOfWeek + index) % 7;
			return bulkDay === "-" || fullNameDaysOfWeek[dayOfWeek] === bulkDay
				? value
				: selections[index];
		});
		setSelections(updatedSelections);
	};

	const BulkSetSection = () => {
		return (
			<div className="flex justify-center items-center mb-4">
				<p className="mr-2">Set all</p>
				<select
					value={bulkDay}
					onChange={(event) => setBulkDay(event.target.value)}
					className="mr-2 p-2 border border-gray-500 rounded bg-gray-800"
				>
					<option value="-">days</option>
					{fullNameDaysOfWeek.map((day) => (
						<option key={day} value={day}>
							{day}
						</option>
					))}
				</select>
				<select
					value={bulkAvailability}
					onChange={(event) => setBulkAvailability(event.target.value)}
					className="mr-2 p-2 border border-gray-500 rounded bg-gray-800"
				>
					{availabilities.map((availability) => (
						<option key={availability} value={availability}>
							{availability}
						</option>
					))}
				</select>
				<p className="mr-2">{/* for other languages*/}</p>
				<PlayButton value={bulkAvailability} onClick={handleBulkApply} />
			</div>
		);
	};

	return (
		<div>
			<BulkSetSection />
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
								{availabilities.map((value) => (
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

const findMonthlySchedule = (
	schedules: MonthlySchedule[],
	year: number,
	month: number,
): Availability[] | undefined => {
	const targetSchedule = schedules.find(
		(schedule: MonthlySchedule) =>
			schedule.year === year && schedule.month === month,
	);
	return targetSchedule?.availabilities;
};

export default Calendar;
