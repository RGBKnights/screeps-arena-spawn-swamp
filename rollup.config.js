import clear from "rollup-plugin-clear";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';

function checkScriptLimit() {
    const scriptLimit = 10000000; // 10mb
    return {
        generateBundle(_options, bundle) {
            for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
                if (fileName === "main.mjs" && chunkOrAsset.code && chunkOrAsset.code.length >= scriptLimit * 0.98) {
                    console.log(
                        `Warning: Script limit is ${scriptLimit / 1000000}mb, output is ${chunkOrAsset.code.length} bytes`
                    );
                }
            }
        }
    };
}

module.exports = {
    input: 'src/index.js',
    external: ["game", "game/prototypes", "game/constants", "game/utils", "game/path-finder", "arena"], // <-- suppresses the warning
    output: {
        dir: "dist/",
        format: 'esm',
        entryFileNames: "main.mjs",
        paths: path => {
            if (path.startsWith("game") || path.startsWith("arena")) {
                return "/" + path;
            }
        },
    },
    plugins: [
        clear({ targets: ["dist"] }),
        resolve({ rootDir: "src" }),
        commonjs(),
        checkScriptLimit(),
    ],
};