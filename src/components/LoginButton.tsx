"use client";

import DiscordLogo from "@public/discord.svg";
import Image from "next/image";
import React from "react";
import { useCookies } from "react-cookie";

interface CustomButtonProps {
	label: string;
	invitationId?: string;
}

const jump = () => {
	const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
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

export const LoginButton: React.FC<CustomButtonProps> = ({
	label,
	invitationId,
}) => {
	const [, setCookie] = useCookies(["invitation_id"]);

	const handleClickLogin = () => {
		if (invitationId) {
			setCookie("invitation_id", invitationId, { path: "/" });
		}
		jump();
	};

	return (
		<button
			onClick={handleClickLogin}
			className="discord-login-button flex items-center"
		>
			<Image src={DiscordLogo} alt="Discord Logo" className="w-6 h-6 mr-2" />
			{label}
		</button>
	);
};
