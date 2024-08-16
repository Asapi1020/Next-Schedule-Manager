"use client";

import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

import { LoginButton } from "@/components/LoginButton";

const Home = () => {
	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;

	const router = useRouter();

	if (accessToken) {
		router.push("/mypage");
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-4xl font-bold mb-4">Schedule Manager</h1>
			<p className="text-lg text-gray-700 mb-8">
				Manage your schedules for discord community.
			</p>
			<LoginButton label="Login with Discord" />
		</div>
	);
};

export default Home;
