"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import { fetchUserInfo } from "@/lib/fetch";
import { UserInfo } from "@/lib/schema";

const MyPage = () => {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [name, setName] = useState<string>("");

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
		return <div className="container mx-auto p-4">Loading...</div>;
	}

	if (!user) {
		return (
			<div className="container mx-auto p-4">Failed to fetch user info</div>
		);
	}

	const handleEditClick = () => {
		setIsEditing(!isEditing);
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleSaveClick = () => {
		//TODO: save on sheet
		setIsEditing(false);
	};

	return (
		<div className="container mx-auto p-4">
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
								<button
									onClick={handleSaveClick}
									className="bg-green-600 text-white py-1 px-3 rounded ml-4 hover:bg-green-700"
								>
									Save
								</button>
							</div>
						) : (
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-semibold">{name}</h2>
								<button
									onClick={handleEditClick}
									className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
								>
									Edit Profile
								</button>
							</div>
						)}
						<p className="text-gray-400 text-sm">ID: {user.id}</p>
					</div>
				</div>
			</div>

			{/* Groups Section */}
			<div className="bg-gray-800 shadow-md rounded-lg p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-semibold leading-tight">Your Groups</h3>
					<button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
						Create New Group
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
