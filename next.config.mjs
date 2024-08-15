/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		GAS_CLIENT_ID: process.env.GAS_CLIENT_ID,
		GAS_CLIENT_SECRET: process.env.GAS_CLIENT_SECRET,
		GAS_REFRESH_TOKEN: process.env.GAS_REFRESH_TOKEN,
		GAS_SCRIPT_ID: process.env.GAS_SCRIPT_ID,
		DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
		NEXT_PUBLIC_FRONTEND_ADDRESS: process.env.NEXT_PUBLIC_FRONTEND_ADDRESS,
	},
	reactStrictMode: false,
	trailingSlash: true,
};

export default nextConfig;
