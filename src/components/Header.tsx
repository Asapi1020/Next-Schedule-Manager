"use client";

import Favicon from "@public/favicon.svg";
import Image from "next/image";
import Link from "next/link";

import { UserButton } from "./UserButton";

export const Header = () => {
	return (
		<header className="header bg-black">
			<div>
				<Image src={Favicon} alt="Favicon" className="w-8 h-8" />
			</div>
			<Link href="/" passHref>
				<h1 className="text-xl font-bold">Schedule Manager</h1>
			</Link>
			<div>
				<UserButton></UserButton>
			</div>
		</header>
	);
};
