/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		GAS_CLIENT_ID: process.env.GAS_CLIENT_ID,
		GAS_CLIENT_SECRET: process.env.GAS_CLIENT_SECRET,
		GAS_REFRESH_TOKEN: process.env.GAS_REFRESH_TOKEN,
		GAS_SCRIPT_ID: process.env.GAS_SCRIPT_ID,
	},
};

export default nextConfig;
