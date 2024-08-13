import { UserButton } from "./UserButton";

export const Header = () => {
	return (
		<header className="flex items-center justify-between p-4 border-b border-gray-300">
			<div>
				<img src="../favicon.ico" alt="" className="w-8 h-8" />
			</div>
			<h1 className="text-xl font-bold">Schedule Manager</h1>
			<div className="px-4 py-2 text-black bg-white rounded hover:bg-gray-200">
				<UserButton></UserButton>
			</div>
		</header>
	);
};
