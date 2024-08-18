import AddCircle from "@public/add-circle.svg";
import ShieldCheck from "@public/shield-check.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";

import CancelButton from "@/components/CancelButton";
import { GroupContext } from "@/components/DataProvider";
import SaveButton from "@/components/SaveButton";
import { addNewGroup } from "@/lib/fetch";
import { GroupInfo, UserInfo } from "@/lib/schema";

interface GroupTemplate {
	accessToken: string;
	userInfo: UserInfo;
}

const GroupSection: React.FC<GroupTemplate> = ({ accessToken, userInfo }) => {
	const context = useContext(GroupContext);
	if (!context) {
		throw new Error("GroupContext must be used within a GroupProvider");
	}
	const { setGroupInfo } = context;
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const router = useRouter();

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
			const response = await addNewGroup(accessToken, userInfo.id, name);

			if (response.status === 200) {
				const newGroupInfo: GroupInfo = await response.json();
				setGroupInfo(newGroupInfo);
				router.push(`/group/${newGroupInfo.id}`);
			} else {
				const { error } = await response.json();
				throw new Error(error);
			}
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to save the new name:", error);
		} finally {
			setIsSaving(false);
		}
	}, [accessToken, name, userInfo.id]);

	const AdminCheckImage = () => {
		const [isHovering, setIsHovering] = useState(false);

		return (
			<div className="relative inline-block">
				<Image
					src={ShieldCheck}
					alt="Admin Check Icon"
					className="w-6 h-6"
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
				/>
				{isHovering && (
					<div className="absolute top-0 right-0 bg-black text-white text-sm p-2 rounded shadow-lg min-w-[250px] transform translate-x-full -translate-y-full bg-opacity-70">
						You are an admin of this group.
					</div>
				)}
			</div>
		);
	};

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
						className="text-lg bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
						aria-label="Group Name"
					/>
				</div>
			)}
			{userInfo.groups.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{userInfo.groups.map((group, index) => (
						<div
							key={index}
							className="bg-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
						>
							<a
								href={`/group/${group.id}`}
								className="flex items-center space-x-2 text-blue-500 hover:underline"
							>
								<h4 className="text-lg font-semibold text-white">
									{group.name}
								</h4>
								{group.adminId === userInfo.id && <AdminCheckImage />}
							</a>
							<p className="text-gray-400 mt-2 text-sm">ID: {group.id}</p>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-400">No groups available</p>
			)}
		</div>
	);
};

export default GroupSection;
