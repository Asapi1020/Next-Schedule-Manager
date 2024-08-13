"use client";

import Link from "next/link";
import { useCookies } from "react-cookie";

const jump = () => {
	const clientId = process.env.DISCORD_CLIENT_ID;
	const frontendAddress = process.env.NEXT_PUBLIC_FRONTEND_ADDRESS;

	if (!clientId || !frontendAddress) {
		console.error("環境変数が正しく設定されていません");
		return;
	}

	window.open(
		"https://discord.com/oauth2/authorize" +
			`?client_id=${clientId}` +
			"&response_type=code" +
			`&redirect_uri=${frontendAddress}/login` +
			"&scope=identify",
	);
};

export const UserButton = () => {
	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;
	if (accessToken) {
		const userId = "";
		return <Link href={`/profile?u=${userId}`}>マイページ</Link>;
	} else {
		return <button onClick={jump}>ログイン</button>;
	}
};
