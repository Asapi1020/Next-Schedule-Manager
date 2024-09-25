export function apiUrl(endPoint: string): URL {
	return new URL("/api" + endPoint, process.env.NEXT_PUBLIC_FRONTEND_ADDRESS);
}
