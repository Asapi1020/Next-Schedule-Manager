import Favicon from "@public/favicon.svg";
import Image from "next/image";

import { UserButton } from "./UserButton";

export const Header = () => {
	return (
		<header className="header">
			<div>
				<Image src={Favicon} alt="Favicon" className="w-8 h-8" />
			</div>
			<h1 className="text-xl font-bold">Schedule Manager</h1>
			<div>
				<UserButton></UserButton>
			</div>
		</header>
	);
};
