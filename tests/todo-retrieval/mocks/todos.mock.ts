import type { ITodo } from "todo-entity";
import { jest } from "@jest/globals";

export const allTodosByRepoMock: jest.Mocked<ITodo>[] = [
   {
      getId: jest.fn<() => string>().mockReturnValue("randomId1"),
      getTitle: jest.fn<() => string>().mockReturnValue("test title1"),
      getDescription: jest
         .fn<() => string>()
         .mockReturnValue("test description1"),
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
   },
   {
      getId: jest.fn<() => string>().mockReturnValue("randomId2"),
      getTitle: jest.fn<() => string>().mockReturnValue("test title2"),
      getDescription: jest
         .fn<() => string>()
         .mockReturnValue("test description2"),
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
   },
   {
      getId: jest.fn<() => string>().mockReturnValue("randomId3"),
      getTitle: jest.fn<() => string>().mockReturnValue("test title3"),
      getDescription: jest
         .fn<() => string>()
         .mockReturnValue("test description3"),
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
   },
];

export const allUncompletedTodosByRepoMock: jest.Mocked<ITodo>[] = [
   {
      getId: jest.fn<() => string>().mockReturnValue("randomId1"),
      getTitle: jest.fn<() => string>().mockReturnValue("test title1"),
      getDescription: jest
         .fn<() => string>()
         .mockReturnValue("test description1"),
      getDoneDate: jest.fn(() => undefined),
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
   },
   {
      getId: jest.fn<() => string>().mockReturnValue("randomId2"),
      getTitle: jest.fn<() => string>().mockReturnValue("test title2"),
      getDescription: jest
         .fn<() => string>()
         .mockReturnValue("test description2"),
      getDoneDate: jest.fn(() => undefined),
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
   },
   {
      getId: jest.fn<() => string>().mockReturnValue("randomId3"),
      getTitle: jest.fn<() => string>().mockReturnValue("test title3"),
      getDescription: jest
         .fn<() => string>()
         .mockReturnValue("test description3"),
      getDoneDate: jest.fn(() => undefined),
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
   },
];

export const todoByIdRepoMock: jest.Mocked<ITodo> = {
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
