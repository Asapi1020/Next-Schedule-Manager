import Upload from "@public/cloud-upload.svg";
import Image from "next/image";
import React from "react";

import { LoadingCircle } from "@/components/LoadingCircle";

interface SaveButtonProps {
	isSaving: boolean;
	onClick: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isSaving, onClick }) => {
	return (
		<button
			onClick={onClick}
			className={`text-white py-2 px-3 rounded ml-4 ${
				isSaving
					? "bg-gray-600 cursor-not-allowed"
					: "bg-green-600 hover:bg-green-700"
			}`}
			disabled={isSaving}
		>
			{isSaving ? (
				<div className="flex justify-center items-center">
					<LoadingCircle />
					Saving...
				</div>
			) : (
				<div className="flex items-center">
					<Image src={Upload} alt="cloud upload" className="w-6 h-6 mr-1" />
					Save
				</div>
			)}
		</button>
	);
};

export default SaveButton;
