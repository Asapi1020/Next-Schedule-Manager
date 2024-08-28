/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_DISCORD_CLIENT_ID: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
		NEXT_PUBLIC_FRONTEND_ADDRESS: process.env.NEXT_PUBLIC_FRONTEND_ADDRESS,
		MONGO_DB_URI: process.env.MONGO_DB_URI,
	},
	reactStrictMode: false,
	trailingSlash: true,
};

export default nextConfig;
