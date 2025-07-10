import type { ILabel } from "todo-entity";
import { jest } from "@jest/globals";

export const inputLabelMock: jest.Mocked<ILabel> = {
   getId: jest.fn(() => "label-id-123"),
   getName: jest.fn<() => string>().mockReturnValue("Important"),
   getColor: jest.fn<() => string>().mockReturnValue("red"),
   setColor: jest.fn(),
   setName: jest.fn(),
};
