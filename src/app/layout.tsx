import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import DataProvider from "@/components/DataProvider";
import { Footer } from "@/components/Footer";
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
			<body className={`${inter.className} flex flex-col min-h-screen`}>
				<DataProvider>
					<Header></Header>
					{children}
					<Footer></Footer>
				</DataProvider>
			</body>
		</html>
	);
}
