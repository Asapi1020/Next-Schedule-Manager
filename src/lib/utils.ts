import { useParams } from "next/navigation";

export const safeLoadGroupId = (): string => {
	const params = useParams();
	const groupId = params?.groupId;
	if (typeof groupId !== "string") {
		return "";
	}
	return groupId;
};
