import React from "react";

import { getBackgroundColorClass } from "./handler";

import { Availability, BaseScheduleInfo, User } from "@/lib/schema";

interface TableTemplate {
	userId: string;
	scheduleData: BaseScheduleInfo[];
	selections: Availability[];
	deltaMonth: number;
	users: User[];
}

const Table: React.FC<TableTemplate> = ({
	userId,
	scheduleData,
	selections,
	deltaMonth,
	users,
}) => {
	const convertIdToName = (id: string): string => {
		const targetUser = users.find((user) => user.id === id);
		return targetUser?.name ?? "Loading";
	};

	const getProperAvailability = (datum: BaseScheduleInfo, index: number) => {
		return userId === datum.userId
			? selections[index]
			: datum.schedules[deltaMonth].availabilities[index];
	};

	return (
		<div>
			<table className=" text-white bg-black border border-gray-700">
				<thead>
					<tr className="bg-gray-800">
						<th className="w-12 px-4 py-2 text-center">Date</th>
						{scheduleData.map((data, index) => (
							<th key={index} className="px-4 py-2 text-left">
								{convertIdToName(data.userId)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{scheduleData[0].schedules[deltaMonth].availabilities.map(
						(availability, index) => (
							<tr key={index} className="border-t border-gray-700">
								<td className="w-12 px-4 py-2 text-right">{index + 1}</td>
								{scheduleData.map((datum) => (
									<td
										className={`px-4 py-2 ${getBackgroundColorClass(getProperAvailability(datum, index))}`}
									>
										{getProperAvailability(datum, index)}
									</td>
								))}
							</tr>
						),
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
