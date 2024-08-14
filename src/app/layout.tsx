import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import "@/styles/globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Schedule Manager",
	description: "Manage schedules",
	icons: {
		icon: "/favicon.svg",
		shortcut: "/favicon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={inter.className}>
				<Header></Header>
				<Suspense fallback={<div>読み込み中...</div>}>{children}</Suspense>
			</body>
		</html>
	);
}
