import type { ILabel } from "todo-entity";

export const labelMock: jest.Mocked<ILabel> = {
   getColor: jest.fn(),
   getId: jest.fn(),
   getName: jest.fn(),
   setColor: jest.fn(),
   setName: jest.fn(),
};
