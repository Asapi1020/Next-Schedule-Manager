import { UserButton } from "./UserButton";

export const Header = () => {
	return (
		<header className="flex items-center justify-between p-4 border-b border-gray-300">
			<div>
				<img src="../favicon.ico" alt="" className="w-8 h-8" />
			</div>
			<h1 className="text-xl font-bold">Schedule Manager</h1>
			<div>
				<UserButton></UserButton>
			</div>
		</header>
	);
};
