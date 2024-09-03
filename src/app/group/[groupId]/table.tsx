import React, { useEffect, useState } from "react";

import { fetchUserNames } from "@/lib/apiClient";
import { getAccessToken } from "@/lib/dataUtils";
import { Availability, BaseScheduleInfo, User } from "@/lib/schema";

interface TableTemplate {
	scheduleData: BaseScheduleInfo[];
	deltaMonth: number;
}

const Table: React.FC<TableTemplate> = ({ scheduleData, deltaMonth }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [users, setUsers] = useState<User[]>([]);
	const accessToken = getAccessToken();

	useEffect(() => {
		const fetchUserNamesData = async () => {
			setIsLoading(true);
			try {
				const usersId = scheduleData.map((datum) => datum.userId);
				const response = await fetchUserNames(accessToken, usersId);
				if (response.status === 200) {
					const fetchedUsers = await response.json();
					setUsers(fetchedUsers);
					return;
				} else {
					const { error } = await response.json();
					setIsError(true);
					console.error(error);
					return;
				}
			} catch (error) {
				console.error(error);
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserNamesData();
	}, []);

	const convertIdToName = (id: string): string => {
		const targetUser = users.find((user) => user.id === id);
		return targetUser?.name ?? "N/A";
	};

	return (
		<div>
			<p>alpha版につき即時反映なし。予定保存直後の場合リロードしてくれい</p>
			<table className=" text-white bg-black border border-gray-700">
				<thead>
					<tr className="bg-gray-800">
						<th className="w-12 px-4 py-2 text-center">Date</th>
						{scheduleData.map((data, index) => (
							<th key={index} className="px-4 py-2 text-left">
								{isError
									? "Error"
									: isLoading
										? "Loading..."
										: convertIdToName(data.userId)}
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
										className={`px-4 py-2 ${getBackgroundColorClass(datum.schedules[deltaMonth].availabilities[index])}`}
									>
										{datum.schedules[deltaMonth].availabilities[index]}
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

const getBackgroundColorClass = (text: string) => {
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

export default Table;
