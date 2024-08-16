"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { LoginButton } from "./LoginButton";
import "@/styles/discord.css";
import UserDropDown from "./UserDropdown";

export const UserButton = () => {
	const [isClient, setIsClient] = useState(false);
	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null;
	}

	if (accessToken) {
		return <UserDropDown></UserDropDown>;
	}

	return <LoginButton label="Login" />;
};
