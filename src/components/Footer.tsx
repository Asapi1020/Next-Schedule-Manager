import { VERSION } from "@/lib/config";

export const Footer = () => {
	return (
		<footer className="footer bg-gray-800">
			<span className="text-sm">Version {VERSION}</span>
			<a href="/privacy-policy" className="text-sm border-x px-4">
				Privacy Policy
			</a>
		</footer>
	);
};
