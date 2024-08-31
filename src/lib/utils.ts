import { useParams } from "next/navigation";

export const safeLoadParam = (paramName: string): string => {
	const params = useParams();
	if (!params) {
		return "";
	}

	const paramValue = params[paramName];
	if (typeof paramValue !== "string") {
		return "";
	}

	return paramValue;
};
