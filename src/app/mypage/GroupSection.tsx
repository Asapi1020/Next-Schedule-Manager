import AddCircle from "@public/add-circle.svg";
import Image from "next/image";
import { useCallback, useState } from "react";

import CancelButton from "@/components/CancelButton";
import SaveButton from "@/components/SaveButton";
import { addNewGroup } from "@/lib/fetch";
import { UserWithAccessToken } from "@/lib/schema";

const GroupSection: React.FC<UserWithAccessToken> = ({ accessToken, user }) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleAddClick = useCallback(() => {
		setIsEditing(true);
	}, []);

	const handleGroupNameChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value);
		},
		[],
	);

	const handleCancelClick = useCallback(() => {
		setIsEditing(false);
	}, []);

	const handleSaveClick = useCallback(async () => {
		setIsSaving(true);
		try {
			await addNewGroup(accessToken, user.id, name);
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to save the new name:", error);
		} finally {
			setIsSaving(false);
		}
	}, [accessToken, name, user.id]);

	return (
		<div className="bg-gray-800 shadow-md rounded-lg p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xl font-semibold leading-tight">Your Groups</h3>
				{isEditing ? (
					<div className="flex items-center">
						<CancelButton onClick={handleCancelClick} />
						<SaveButton isSaving={isSaving} onClick={handleSaveClick} />
					</div>
				) : (
					<button
						onClick={handleAddClick}
						className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
					>
						<div className="flex items-center">
							<Image
								src={AddCircle}
								alt="add circle"
								className="w-6 h-6 mr-1"
							/>
							Create New Group
						</div>
					</button>
				)}
			</div>
			{isEditing && (
				<div className="flex items-center mb-4 bg-gray-600 rounded-lg p-6 shadow-lg">
					<p className="text-gray-200 mr-4 text-lg">Group Name: </p>
					<input
						type="text"
						value={name}
						onChange={handleGroupNameChange}
						className="text-2xl font-semibold bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
						aria-label="Group Name"
					/>
				</div>
			)}
			{user.groupsId.length > 0 ? (
				<ul>
					{user.groupsId.map((groupId, index) => (
						<li key={index}>
							<a
								href={`/groups/${groupId}`}
								className="text-blue-500 hover:underline"
							>
								{groupId}
							</a>
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-400">No groups available</p>
			)}
		</div>
	);
};

export default GroupSection;
