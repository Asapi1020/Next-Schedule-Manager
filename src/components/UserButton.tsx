"use client";

import Link from "next/link";
import { useCookies } from "react-cookie";

import { LoginButton } from "./LoginButton";

export const UserButton = () => {
	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;
	if (accessToken) {
		const userId = "";
		return <Link href={`/profile?u=${userId}`}>マイページ</Link>;
	} else {
		return <LoginButton label="Login" />;
	}
};
