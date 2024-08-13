"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

import GasApi from "@/lib/gasApi";

function ObtainLogin() {
	const [, setCookie] = useCookies(["access_token"]);
	const router = useRouter();
	const searchParams = useSearchParams();
	const gasApi = new GasApi();

	useEffect(() => {
		const handleLogin = async () => {
			const code = searchParams.get("code") ?? null;
			if (!code) {
				router.push("/");
				return;
			}

			const data = await gasApi.execGas("signInWithDiscord", [code]);
			console.log({
				login_try: data,
			});
			if (data.error) {
				router.push("/");
				throw new Error(`Error GAS: ${data.error.message}`);
			}

			const result = data.response.result;
			console.log(result);
			if (result.statusCode === 200) {
				const accessToken = result.payload;
				setCookie("access_token", accessToken, {
					path: "/",
				});
				router.push("/");
				return;
			}
			if (result.statusCode === 400) {
				router.push("/");
				throw new Error("Error OAuth: Bad Request");
			}
			if (result.statusCode === 401) {
				router.push("/");
				throw new Error("Error OAuth: Unauthorized");
			}
			if (result.statusCode === 500) {
				router.push("/");
				throw new Error("Error GAS: Internal Server Error");
			}
		};

		handleLogin();
	}, [searchParams, router, gasApi, setCookie]);

	return <></>;
}

export default function Home() {
	return <ObtainLogin />;
}
