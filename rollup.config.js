import typescript from "rollup-plugin-typescript"
import peerDepsExternal from "rollup-plugin-peer-deps-external"

import pkg from "./package.json"

export default [
    {
        input: "src/index.ts",
        external: ["ms"],
        plugins: [peerDepsExternal(), typescript()],
        output: [
            { file: pkg.main, format: "cjs" },
            { file: pkg.module, format: "es" },
        ],
    },
]
