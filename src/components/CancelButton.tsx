import React from "react";

interface CancelButtonProps {
	onClick: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className="bg-red-600 text-white py-2 px-3 rounded mr-4 hover:bg-red-700"
		>
			Cancel
		</button>
	);
};

export default CancelButton;
