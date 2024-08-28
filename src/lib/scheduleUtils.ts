import {
	Availability,
	BaseScheduleInfo,
	GroupWithSchedules,
	MonthlySchedule,
} from "./schema";

export const findMySchedule = (
	groupSchedules: GroupWithSchedules,
	myUserId: string,
): MonthlySchedule[] => {
	const myScheduleData = groupSchedules.scheduleData.find(
		(schedule: BaseScheduleInfo) => schedule.userId === myUserId,
	);
	return myScheduleData?.schedules ?? [];
};

export const fixSchedule = (
	schedules: MonthlySchedule[],
): MonthlySchedule[] => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();

	for (let i = 0; i < 3; i++) {
		const checkYear = currentYear + Math.floor((currentMonth + i) / 12);
		const checkMonth = (currentMonth + i) % 12;

		const schedule = findSchedule(schedules, checkYear, checkMonth);

		if (!schedule) {
			schedules.push({
				year: checkYear,
				month: checkMonth,
				availabilities: createDefaultAvailability(checkYear, checkMonth),
			});
		}
	}

	return schedules;
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
