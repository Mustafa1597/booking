import { fileURLToPath } from "url";
import path from "path";

import config from "eslint-config-standard";
import eslintConfigPrettier from "eslint-config-prettier";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const configs = [
    ...compat.config(config),
    eslintConfigPrettier,
    {
        rules: {
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "object",
                        "type",
                    ],
                    "newlines-between": "always",
                    alphabetize: { order: "desc" },
                },
            ],
        },
    },
];

/** @type {import('eslint').Linter.Config[]} */
export default configs;
