import type { ILabel, ITodo } from "todo-entity";
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
   removeLabel: jest.fn(),
   modifyTitle: jest.fn(),
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
   removeLabel: jest.fn(),
   modifyTitle: jest.fn(),
};

export const fakeTodoToEdit: jest.Mocked<ITodo> = {
   getId: jest.fn<() => string>().mockReturnValue("123"),
   getTitle: jest.fn<() => string>().mockReturnValue("title"),
   getDescription: jest.fn<() => string>().mockReturnValue("desc"),
   getDoneDate: jest.fn(),
   getDueDate: jest.fn(),
   getLabels: jest.fn<() => ILabel[]>().mockReturnValue([
      {
         getId: jest.fn<() => string>().mockReturnValue("label1"),
         getName: jest.fn<() => string>().mockReturnValue("label1"),
         getColor: jest.fn<() => string>(),
         setColor: jest.fn<(color: string) => string>(),
         setName: jest.fn<(name: string) => string>(),
      },
   ]),
   modifyTitle: jest.fn(),
   describe: jest.fn(),
   addDeadline: jest.fn(),
   addLabel: jest.fn(),
   removeLabel: jest.fn(),
   accomplish: jest.fn(),
   resurrect: jest.fn(),
   reportDeadline: jest.fn(),
};
