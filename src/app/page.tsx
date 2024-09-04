"use client";

import { useCookies } from "react-cookie";

import { LoginButton } from "@/components/LoginButton";

const Home = () => {
	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;

	return (
		<div
			className="flex flex-col items-center justify-center"
			style={{ minHeight: "85vh" }}
		>
			<h1 className="text-4xl font-bold mb-4">Schedule Manager</h1>
			<p className="text-lg text-gray-700 mb-8">
				Manage your schedules for discord community.
			</p>
			{accessToken ? null : <LoginButton label="Login with Discord" />}
		</div>
	);
};

export default Home;
