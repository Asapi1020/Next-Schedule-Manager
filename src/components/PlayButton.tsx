import Play from "@public/play.svg";
import Image from "next/image";

interface PlayButtonProps {
	value: string;
	onClick: (value: string) => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ value, onClick }) => {
	return (
		<button
			onClick={() => onClick(value)}
			className="mr-2 p-2 border border-green-500 rounded bg-green-800"
		>
			<Image src={Play} alt="play" className="w-6 h-6 mx-2" />
		</button>
	);
};

export default PlayButton;
