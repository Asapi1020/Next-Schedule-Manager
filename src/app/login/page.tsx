"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

import { signInWithDiscord } from "@/lib/fetch";

function ObtainLogin() {
	const [, setCookie] = useCookies(["access_token"]);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const handleLogin = async () => {
			const code = searchParams.get("code") ?? null;
			if (!code) {
				router.push("/");
				return;
			}

			const response = await signInWithDiscord(code);

			if (response.status === 200) {
				const accessToken = await response.json();
				setCookie("access_token", accessToken, {
					path: "/",
				});
				router.push("/");
				return;
			}
			if (response.status === 400) {
				router.push("/");
				throw new Error("Error OAuth: Bad Request");
			}
			if (response.status === 401) {
				router.push("/");
				throw new Error("Error OAuth: Unauthorized");
			}
			if (response.status === 500) {
				router.push("/");
				throw new Error("Error GAS: Internal Server Error");
			}
		};

		handleLogin();
	}, []);

	return <></>;
}

export default function Home() {
	return <ObtainLogin />;
}
