"use client";

import AddCircle from "@public/add-circle.svg";
import CheckCircle from "@public/check-circle.svg";
import Upload from "@public/cloud-upload.svg";
import EditSquare from "@public/edit.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import { LoadingCircle } from "@/components/LoadingCircle";
import { changeUserName, fetchUserInfo } from "@/lib/fetch";
import { UserInfo } from "@/lib/schema";

const MyPage = () => {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;

	const router = useRouter();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetchUserInfo(accessToken);

				if (response.status === 200) {
					const userInfo: UserInfo = await response.json();
					setUser(userInfo);
					setName(userInfo.name);
					return;
				} else {
					const { error } = await response.json();
					router.push("/");
					throw new Error(error);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center container mx-auto p-4">
				<LoadingCircle />
				Loading...
			</div>
		);
	}

	if (!user) {
		return (
			<div className="container mx-auto p-4">Failed to fetch user info</div>
		);
	}

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
			await changeUserName(accessToken, user.id, name);
			setIsEditing(false);
			setIsSaved(true);
		} catch (error) {
			console.error("Failed to save the new name:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="container mx-auto px-6 py-4">
			{/* Profile Section */}
			<div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6">
				<div className="flex items-center">
					{/* Avatar */}
					<img
						src={`https://cdn.discordapp.com/avatars/${user.accountId}/${user.avatarHash}.png`}
						alt="User Avatar"
						className="w-12 h-12 rounded-full mr-4"
					/>
					<div className="flex-1">
						{isEditing ? (
							<div className="flex items-center justify-between">
								<input
									type="text"
									value={name}
									onChange={handleNameChange}
									className="text-2xl font-semibold bg-gray-700 text-white p-1 rounded"
								/>
								<div className="flex items-center">
									<button
										onClick={handleCancelClick}
										className="bg-red-600 text-white py-2 px-3 rounded mr-4 hover:bg-red-700"
									>
										Cancel
									</button>
									<button
										onClick={handleSaveClick}
										className={`text-white py-2 px-3 rounded ml-4 ${
											isSaving
												? "bg-gray-600"
												: "bg-green-600 hover:bg-green-700"
										}`}
										disabled={isSaving}
									>
										{isSaving ? (
											<div className="flex justify-center items-center">
												<LoadingCircle />
												Saving...
											</div>
										) : (
											<div className="flex items-center">
												<Image
													src={Upload}
													alt="cloud upload"
													className="w-6 h-6 mr-1"
												/>
												Save
											</div>
										)}
									</button>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-semibold">{name}</h2>
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
						)}
						<div className="flex items-center justify-between">
							<p className="text-gray-400 text-sm">ID: {user.id}</p>
							{isSaved && (
								<div className="flex items-center mt-2">
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

			{/* Groups Section */}
			<div className="bg-gray-800 shadow-md rounded-lg p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-semibold leading-tight">Your Groups</h3>
					<button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
						<div className="flex items-center">
							<Image
								src={AddCircle}
								alt="add circle"
								className="w-6 h-6 mr-1"
							/>
							Create New Group
						</div>
					</button>
				</div>
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
		</div>
	);
};

export default MyPage;
