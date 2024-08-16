import Logout from "@public/logout.svg";
import UserCircle from "@public/user-circle.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserDropDown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleMyPage = () => {
		router.push("/mypage");
	};

	const handleLogout = () => {
		router.push("/logout");
	};

	return (
		<div className="relative inline-block text-left">
			<button
				onClick={handleToggle}
				className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-black text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Menu
			</button>
			{isOpen && (
				<div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-black ring-1 ring-white ring-opacity-5 border border-gray-300">
					<div
						className="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						<button
							onClick={handleMyPage}
							className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 w-full text-left"
							role="menuitem"
						>
							<div className="flex items-center">
								<Image
									src={UserCircle}
									alt="user circle"
									className="mr-2 w-6 h-6"
								/>
								My Page
							</div>
						</button>
						<button
							onClick={handleLogout}
							className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 w-full text-left"
							role="menuitem"
						>
							<div className="flex items-center">
								<Image src={Logout} alt="Logout" className="mr-2 w-6 h-6" />
								Logout
							</div>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserDropDown;
