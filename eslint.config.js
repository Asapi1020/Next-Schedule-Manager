import asp1020 from "@asp1020/eslint-config";

export default [
	...asp1020.configs.node,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parserOptions: { project: "tsconfig.eslint.json" },
		},
	},
	{
		ignores: [".next"],
	},
];
