import { Dispatch, SetStateAction, useContext } from "react";
import { useCookies } from "react-cookie";

import { UserProfile } from "./schema";

import { UserContext } from "@/components/DataProvider";

export function getAccessToken(): string {
	const [cookies] = useCookies<string>();
	const accessToken = cookies.access_token;
	return accessToken;
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
