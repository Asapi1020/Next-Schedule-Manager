"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

import { LoadingCircle } from "@/components/LoadingCircle";
import { signInWithDiscord } from "@/lib/apiClient";

function ObtainLogin() {
	const [, setCookie] = useCookies(["access_token"]);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const handleLogin = async () => {
			try {
				const code = searchParams?.get("code") ?? null;
				if (!code) {
					router.push("/");
					return;
				}

				const response = await signInWithDiscord(code);

				if (response.status === 200) {
					const { accessToken } = await response.json();
					setCookie("access_token", accessToken, {
						path: "/",
					});
					router.push("/mypage");
					return;
				} else {
					router.push("/");
					const { error } = await response.json();
					throw new Error(error);
				}
			} catch (error) {
				console.error("Login error", error);
				router.push("/");
			}
		};

		handleLogin();
	}, [searchParams]);

	return (
		<div className="flex justify-center items-center container mx-auto p-4">
			<LoadingCircle />
			Authorizing...
		</div>
	);
}

export default function Home() {
	return <ObtainLogin />;
}
