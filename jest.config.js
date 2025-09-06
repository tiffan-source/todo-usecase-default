import { createDefaultEsmPreset, pathsToModuleNameMapper } from "ts-jest";

const presetConfig = createDefaultEsmPreset({
   //...options
});

import config from "./tsconfig.json" with { type: "json" };

/** @type {import("jest").Config} **/
export default {
   testEnvironment: "node",
   ...presetConfig,
   moduleNameMapper: pathsToModuleNameMapper(config.compilerOptions.paths, {
      prefix: "<rootDir>/",
      useESM: true,
   }),
   moduleFileExtensions: ["ts", "js", "json"],
   // collectCoverage: true,
   collectCoverageFrom: ["./src/**/*.ts"],
   coverageDirectory: "coverage",
};
