"use client";

import React, { createContext, ReactNode, useEffect, useState } from "react";

import { UserProfile } from "@/lib/schema";

interface UserContextType {
	userInfo: UserProfile | null;
	setUserInfo: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

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

export default function DataProvider({ children }: { children: ReactNode }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null;
	}

	return <UserProvider>{children}</UserProvider>;
}
