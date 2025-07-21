import type { ILabel, ITodo } from "todo-entity";
import { jest } from "@jest/globals";

export const inputTodoMock: jest.Mocked<ITodo> = {
   getId: jest.fn(),
   getTitle: jest.fn<() => string>().mockReturnValue("test title"),
   getDescription: jest.fn<() => string>().mockReturnValue("test description"),
   getDoneDate: jest.fn(),
   getDueDate: jest.fn(() => new Date("2023-10-01T00:00:00Z")),
   describe: jest.fn(),
   accomplish: jest.fn(),
   resurrect: jest.fn(),
   addDeadline: jest.fn(),
   reportDeadline: jest.fn(),
   addLabel: jest.fn(),
   getLabels: jest.fn(),
   removeLabel: jest.fn(),
   modifyTitle: jest.fn(),
};

export const intputLabelListMock: jest.Mocked<ILabel[]> = [
   {
      getId: jest.fn(),
      getName: jest.fn(),
      getColor: jest.fn(),
      setColor: jest.fn(),
      setName: jest.fn(),
   },
];

export const outputTodoRepositoryMock: jest.Mocked<ITodo> = {
   getId: jest.fn<() => string>().mockReturnValue("randomId"),
   getTitle: jest.fn<() => string>().mockReturnValue("test title"),
   getDescription: jest.fn<() => string>().mockReturnValue("test description"),
   getDoneDate: jest.fn(),
   getDueDate: jest.fn(),
   describe: jest.fn(),
   accomplish: jest.fn(),
   resurrect: jest.fn(),
   addDeadline: jest.fn(),
   reportDeadline: jest.fn(),
   addLabel: jest.fn(),
   getLabels: jest.fn(),
   removeLabel: jest.fn(),
   modifyTitle: jest.fn(),
};
