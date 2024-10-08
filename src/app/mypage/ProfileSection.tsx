"use client";

import CheckCircle from "@public/check-circle.svg";
import EditSquare from "@public/edit.svg";
import ReloadArrow from "@public/reload.svg";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";

import { changeUserName } from "@/apiClient/post";
import CancelButton from "@/components/CancelButton";
import SaveButton from "@/components/SaveButton";
import { UserProfile } from "@/lib/schema";

interface ProfileTemplate {
	accessToken: string;
	userInfo: UserProfile;
	setUserInfo: Dispatch<SetStateAction<UserProfile | null>>;
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
		setName(userInfo.name);
		setIsEditing(false);
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleSaveClick = async () => {
		setIsSaving(true);
		try {
			await changeUserName(accessToken, name);
			setUserInfo({ ...userInfo, name });
			setIsEditing(false);
			setIsSaved(true);
		} catch (error) {
			console.error("Failed to save the new name:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleReloadUserInfo = async () => {
		setUserInfo(null);
	};

	const ReloadButton = () => {
		return (
			<button
				onClick={handleReloadUserInfo}
				className="text-white py-1 px-2 rounded border"
			>
				<Image
					src={ReloadArrow}
					alt="reload arrow path"
					className="w-6 h-6 mr-1"
				/>
			</button>
		);
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
					<div className="ml-4">
						<SaveButton isSaving={isSaving} onClick={handleSaveClick} />
					</div>
				</div>
			</div>
		);
	};

	const renderDefaultView = () => {
		return (
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold p-2">{name}</h2>
				<div>
					<div className="flex justify-between items-center mb-2">
						<div />
						<ReloadButton />
					</div>
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
