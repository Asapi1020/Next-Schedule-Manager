import { Dispatch, SetStateAction, useContext } from "react";
import { useCookies } from "react-cookie";

import { Group, UserProfile } from "./schema";

import { GroupContext, UserContext } from "@/components/DataProvider";

export function getAccessToken(): string {
	return getCookieValue("access_token");
}

export function getCookieValue(cookieName: string): string {
	const [cookies] = useCookies<string>();
	const cookieValue = cookies[cookieName];
	return cookieValue ?? "";
}

export function useUserContext(): [
	UserProfile | null,
	Dispatch<SetStateAction<UserProfile | null>>,
] {
	const userContext = useContext(UserContext);
	if (!userContext) {
		console.error("UserContext must be used within a UserProvider");
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return [null, () => {}];
	}
	const { userInfo, setUserInfo } = userContext;
	return [userInfo, setUserInfo];
}

export function useGroupContext(): [
	Group | null,
	Dispatch<SetStateAction<Group | null>>,
] {
	const groupContext = useContext(GroupContext);
	if (!groupContext) {
		console.error("GroupContext must be used within a GroupProvider");
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return [null, () => {}];
	}
	const { groupInfo, setGroupInfo } = groupContext;
	return [groupInfo, setGroupInfo];
}
