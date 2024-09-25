import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

import { fetchUserInfo } from "../apiClient/get";

import { UserProfile } from "./schema";

const authEffect = (
	accessToken: string,
	setLoading: Dispatch<SetStateAction<boolean>>,
	userInfo: UserProfile | null,
	setUserInfo: Dispatch<SetStateAction<UserProfile | null>>,
) => {
	const router = useRouter();

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);

			try {
				const response = await fetchUserInfo(accessToken);

				if (response.status === 200) {
					const newUserInfo: UserProfile = await response.json();
					setUserInfo(newUserInfo);
					return;
				} else {
					const { error } = await response.json();
					setUserInfo(null);
					router.push("/");
					console.error(error);
					return;
				}
			} catch (error) {
				setUserInfo(null);
				router.push("/");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		if (!accessToken) {
			router.push("/");
			return;
		}

		if (!userInfo) {
			fetchUserData();
		}
	}, [accessToken, userInfo]);
};

export default authEffect;
