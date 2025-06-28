import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset({
   //...options
});

/** @type {import("jest").Config} **/
export default {
   testEnvironment: "node",
   ...presetConfig,
   moduleNameMapper: {
      "^@todo-creation/(.*).js$": "<rootDir>/src/todo-creation/$1",
      "^@tests/(.*).js$": "<rootDir>/tests/$1",
   },
   moduleFileExtensions: ["ts", "js", "json"],
   collectCoverage: true,
   collectCoverageFrom: ["./src/**/*.ts"],
   coverageDirectory: "coverage",
};
