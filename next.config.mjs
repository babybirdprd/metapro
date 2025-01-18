/** @type {import('next').NextConfig} */
const nextConfig = {
	publicRuntimeConfig: {
		OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
	},
};

export default nextConfig;
