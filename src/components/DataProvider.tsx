"use client";

import React, { createContext, ReactNode, useState } from "react";

import { GroupInfo, UserInfo } from "@/lib/schema";

interface UserContextType {
	userInfo: UserInfo | null;
	setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

interface GroupContextType {
	groupInfo: GroupInfo | null;
	setGroupInfo: React.Dispatch<React.SetStateAction<GroupInfo | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);
export const GroupContext = createContext<GroupContextType | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	return (
		<UserContext.Provider value={{ userInfo, setUserInfo }}>
			{children}
		</UserContext.Provider>
	);
}

function GroupProvider({ children }: { children: ReactNode }) {
	const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);

	return (
		<GroupContext.Provider value={{ groupInfo, setGroupInfo }}>
			{children}
		</GroupContext.Provider>
	);
}

export default function DataProvider({ children }: { children: ReactNode }) {
	return (
		<UserProvider>
			<GroupProvider>{children}</GroupProvider>
		</UserProvider>
	);
}
