"use client";

import CheckCircle from "@public/check-circle.svg";
import EditSquare from "@public/edit.svg";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";

import CancelButton from "@/components/CancelButton";
import SaveButton from "@/components/SaveButton";
import { changeUserName } from "@/lib/fetch";
import { UserInfo } from "@/lib/schema";

interface ProfileTemplate {
	accessToken: string;
	userInfo: UserInfo;
	setUserInfo: Dispatch<SetStateAction<UserInfo | null>>;
}

const ProfileSection: React.FC<ProfileTemplate> = ({
	accessToken,
	userInfo,
	setUserInfo,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [name, setName] = useState<string>(userInfo.name);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	const handleEditClick = () => {
		setIsSaved(false);
		setIsEditing(!isEditing);
	};

	const handleCancelClick = () => {
		setIsEditing(false);
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleSaveClick = async () => {
		setIsSaving(true);
		try {
			await changeUserName(accessToken, userInfo.id, name);
			setUserInfo(userInfo);
			setIsEditing(false);
			setIsSaved(true);
		} catch (error) {
			console.error("Failed to save the new name:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const renderEditingView = () => {
		return (
			<div className="flex items-center justify-between">
				<input
					type="text"
					value={name}
					onChange={handleNameChange}
					className="text-2xl font-semibold bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300"
				/>
				<div className="flex items-center">
					<CancelButton onClick={handleCancelClick} />
					<SaveButton isSaving={isSaving} onClick={handleSaveClick} />
				</div>
			</div>
		);
	};

	const renderDefaultView = () => {
		return (
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold p-2">{name}</h2>
				<button
					onClick={handleEditClick}
					className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
				>
					<div className="flex items-center">
						<Image
							src={EditSquare}
							alt="edit pencil square"
							className="w-6 h-6 mr-1"
						/>
						Edit Profile
					</div>
				</button>
			</div>
		);
	};

	return (
		<div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6">
			<div className="flex items-center">
				{/* Avatar */}
				<img
					src={`https://cdn.discordapp.com/avatars/${userInfo.accountId}/${userInfo.avatarHash}.png`}
					alt="User Avatar"
					className="w-12 h-12 rounded-full mr-4"
				/>
				<div className="flex-1">
					{isEditing ? renderEditingView() : renderDefaultView()}
					<div className="flex items-center justify-between p-2">
						<p className="text-gray-400 text-sm">ID: {userInfo.id}</p>
						{isSaved && (
							<div className="flex items-center">
								<Image
									src={CheckCircle}
									alt="check circle"
									className="w-6 h-6 mr-1"
								/>
								<p className="text-green-500 text-sm mr-4">Saved.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileSection;
