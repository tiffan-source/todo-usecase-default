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
      "^@todo-modification/(.*).js$": "<rootDir>/src/todo-modification/$1",
      "^@todo-retrieval/(.*).js$": "<rootDir>/src/todo-retrieval/$1",
      "^@tests/(.*).js$": "<rootDir>/tests/$1",
   },
   moduleFileExtensions: ["ts", "js", "json"],
   collectCoverage: true,
   collectCoverageFrom: ["./src/**/*.ts"],
   coverageDirectory: "coverage",
};
