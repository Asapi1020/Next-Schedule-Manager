"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

import { signInWithDiscord } from "@/apiClient/get";
import { LoadingCircle } from "@/components/LoadingCircle";
import { getCookieValue } from "@/lib/dataUtils";

function ObtainLogin() {
	const [, setCookie] = useCookies(["access_token"]);
	const router = useRouter();
	const searchParams = useSearchParams();
	const invitationId = getCookieValue("invitation_id");
	const removeCookie = useCookies(["invitation_id"])[2];

	useEffect(() => {
		const handleLogin = async () => {
			removeCookie("invitation_id", {
				path: "/",
			});
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
						maxAge: 60 * 60 * 24 * 7,
						sameSite: "lax",
						path: "/",
					});
					router.push(invitationId ? `/invitation/${invitationId}` : "/mypage");
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
