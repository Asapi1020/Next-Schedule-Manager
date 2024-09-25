import {
	Availability,
	BaseScheduleInfo,
	GroupWithSchedules,
	MonthlySchedule,
} from "@/lib/schema";

export const findMonthlySchedule = (
	schedules: MonthlySchedule[],
	year: number,
	month: number,
): Availability[] => {
	const targetSchedule = findSchedule(schedules, year, month);

	return (
		targetSchedule?.availabilities || createDefaultAvailability(year, month)
	);
};

export const findMySchedule = (
	groupSchedules: GroupWithSchedules,
	myUserId: string,
): MonthlySchedule[] => {
	const myScheduleData = groupSchedules.scheduleData.find(
		(schedule: BaseScheduleInfo) => schedule.userId === myUserId,
	);
	return myScheduleData?.schedules ?? [];
};

const fixSchedule = (schedules: MonthlySchedule[]): MonthlySchedule[] => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();
	const fixedSchedule = [];

	for (let i = 0; i < 3; i++) {
		const checkYear = currentYear + Math.floor((currentMonth + i) / 12);
		const checkMonth = (currentMonth + i) % 12;

		const schedule = findSchedule(schedules, checkYear, checkMonth);

		if (schedule) {
			fixedSchedule.push(schedule);
		} else {
			fixedSchedule.push({
				year: checkYear,
				month: checkMonth,
				availabilities: createDefaultAvailability(checkYear, checkMonth),
			});
		}
	}

	return fixedSchedule;
};

export const fixSchedules = (
	scheduleData: BaseScheduleInfo[],
	userId: string | undefined,
) => {
	if (
		!scheduleData.some((datum) => datum.userId === userId) &&
		typeof userId === "string"
	) {
		scheduleData.push({
			userId,
			schedules: [],
		});
	}

	return scheduleData.map((scheduleDatum: BaseScheduleInfo) => {
		scheduleDatum.schedules = fixSchedule(scheduleDatum.schedules);
		return scheduleDatum;
	});
};

export const findSchedule = (
	schedules: MonthlySchedule[],
	year: number,
	month: number,
): MonthlySchedule | undefined => {
	return schedules.find(
		(schedule) => schedule.year === year && schedule.month === month,
	);
};

export const createDefaultAvailability = (
	year: number,
	month: number,
): Availability[] => {
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	return Array.from({ length: daysInMonth }, () => "-");
};

/**
 * @param schedules 元の3か月分の予定
 * @param newSchedule 更新したい月の予定
 * @returns 更新後の3か月分の予定
 */
export const updateAvailabilities = (
	schedules: MonthlySchedule[],
	newSchedule: MonthlySchedule,
): MonthlySchedule[] => {
	return schedules.map((schedule: MonthlySchedule) => {
		if (
			schedule.year === newSchedule.year &&
			schedule.month === newSchedule.month
		) {
			return { ...schedule, availabilities: newSchedule.availabilities };
		}
		return schedule;
	});
};

export const getBackgroundColorClass = (text: string) => {
	switch (text as Availability) {
		case "〇": {
			return "bg-green-600";
		}
		case "△": {
			return "bg-yellow-600";
		}
		case "×": {
			return "bg-red-600";
		}
		default: {
			return "";
		}
	}
};
