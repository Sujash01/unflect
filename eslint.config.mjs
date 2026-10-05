import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/**
 * eslint-config-next v16 exports a native flat-config array, so it is spread
 * directly rather than run through FlatCompat.
 *
 * The TypeScript override must carry the same `files` scope as the config that
 * registers the plugin, otherwise the plugin is not resolvable in that block.
 */
const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;