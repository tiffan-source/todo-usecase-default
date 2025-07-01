import type { ITodo } from "todo-entity";
import { jest } from "@jest/globals";

export const outputTodoNonCompletedRepositoryMock: jest.Mocked<ITodo> = {
   getId: jest.fn<() => string>().mockReturnValue("randomId"),
   getTitle: jest.fn<() => string>().mockReturnValue("test title"),
   getDescription: jest.fn<() => string>().mockReturnValue("test description"),
   getDoneDate: jest.fn<() => Date | undefined>().mockReturnValue(undefined),
   getDueDate: jest.fn(),
   describe: jest.fn(),
   accomplish: jest.fn(() => {
      outputTodoNonCompletedRepositoryMock.getDoneDate.mockReturnValue(
         new Date(),
      );
      return true;
   }),
   resurrect: jest.fn(),
   addDeadline: jest.fn(),
   reportDeadline: jest.fn(),
   addLabel: jest.fn(),
   getLabels: jest.fn(),
};

export const outputTodoCompletedRepositoryMock: jest.Mocked<ITodo> = {
   getId: jest.fn<() => string>().mockReturnValue("randomId"),
   getTitle: jest.fn<() => string>().mockReturnValue("test title"),
   getDescription: jest.fn<() => string>().mockReturnValue("test description"),
   getDoneDate: jest.fn<() => Date | undefined>().mockReturnValue(new Date()),
   getDueDate: jest.fn(),
   describe: jest.fn(),
   accomplish: jest.fn(),
   resurrect: jest.fn(function () {
      outputTodoCompletedRepositoryMock.getDoneDate.mockReturnValue(undefined);
      return true;
   }),
   addDeadline: jest.fn(),
   reportDeadline: jest.fn(),
   addLabel: jest.fn(),
   getLabels: jest.fn(),
};
