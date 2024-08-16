"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function Home() {
	const removeCookie = useCookies(["access_token"])[2];
	const router = useRouter();

	useEffect(() => {
		removeCookie("access_token", {
			path: "/",
		});

		router.push("/");
	});

	return;
}
