import type { ILabel } from "todo-entity";
import { jest } from "@jest/globals";

export const labelMock: jest.Mocked<ILabel> = {
   getColor: jest.fn(),
   getId: jest.fn(),
   getName: jest.fn(),
   setColor: jest.fn(),
   setName: jest.fn(),
};

export const nonExistingLabelMock: jest.Mocked<ILabel> = {
   getColor: jest.fn(),
   getId: jest.fn(() => "non-existing-label-id"),
   getName: jest.fn(() => "non-existing-label"),
   setColor: jest.fn(),
   setName: jest.fn(),
};
