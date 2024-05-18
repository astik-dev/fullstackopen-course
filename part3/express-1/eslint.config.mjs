import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    pluginJs.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                process: "readonly",
            },
        },
        'plugins': {
            '@stylistic/js': stylisticJs,
        },
        'rules': {
            '@stylistic/js/indent': [
                'error',
                4
            ],
            '@stylistic/js/quotes': [
                'error',
                'double'
            ],
            '@stylistic/js/semi': [
                'error',
                'always'
            ],
            'arrow-spacing': [
                'error', { 'before': true, 'after': true }
            ],
            'no-console': 0,
        },
    },
    {
        languageOptions: { globals: globals.browser }
    },
    {
        ignores: ["frontend/"]
    }
];
