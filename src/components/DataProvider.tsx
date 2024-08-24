"use client";

import React, { createContext, ReactNode, useEffect, useState } from "react";

import { GroupInfo, UserProfile } from "@/lib/schema";

interface UserContextType {
	userInfo: UserProfile | null;
	setUserInfo: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

interface GroupContextType {
	groupInfo: GroupInfo | null;
	setGroupInfo: React.Dispatch<React.SetStateAction<GroupInfo | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);
export const GroupContext = createContext<GroupContextType | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
	const [userInfo, setUserInfo] = useState<UserProfile | null>(() => {
		if (typeof window !== "undefined") {
			const savedUserInfo = localStorage.getItem("userInfo");
			return savedUserInfo ? JSON.parse(savedUserInfo) : null;
		}
		return null;
	});

	useEffect(() => {
		if (userInfo) {
			localStorage.setItem("userInfo", JSON.stringify(userInfo));
		} else {
			localStorage.removeItem("userInfo");
		}
	}, [userInfo]);

	return (
		<UserContext.Provider value={{ userInfo, setUserInfo }}>
			{children}
		</UserContext.Provider>
	);
}

function GroupProvider({ children }: { children: ReactNode }) {
	const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(() => {
		if (typeof window !== "undefined") {
			const savedGroupInfo = localStorage.getItem("groupInfo");
			return savedGroupInfo ? JSON.parse(savedGroupInfo) : null;
		}
		return null;
	});

	useEffect(() => {
		if (groupInfo) {
			localStorage.setItem("groupInfo", JSON.stringify(groupInfo));
		} else {
			localStorage.removeItem("groupInfo");
		}
	}, [groupInfo]);

	return (
		<GroupContext.Provider value={{ groupInfo, setGroupInfo }}>
			{children}
		</GroupContext.Provider>
	);
}

export default function DataProvider({ children }: { children: ReactNode }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null;
	}

	return (
		<UserProvider>
			<GroupProvider>{children}</GroupProvider>
		</UserProvider>
	);
}
