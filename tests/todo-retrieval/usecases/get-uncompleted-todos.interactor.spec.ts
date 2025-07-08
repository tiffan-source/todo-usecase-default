import type { GetUncompletedTodosRepositoryOutput } from "todo-usecase";
import { GetUncompletedTodosInteractor } from "@todo-retrieval/usecases/get-uncompleted-todos.interactor.js";
import { jest } from "@jest/globals";
import { allUncompletedTodosByRepoMock } from "../mocks/todos.mock.js";

describe("GetUncompletedTodoInteractor", () => {
   const repository = {
      execute: jest.fn<() => Promise<GetUncompletedTodosRepositoryOutput>>(),
   };

   const presenter = {
      present: jest.fn(),
      setCallback: jest.fn(),
   };

   const interactor = new GetUncompletedTodosInteractor(repository, presenter);

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      repository.execute = jest.fn(() =>
         Promise.resolve(allUncompletedTodosByRepoMock),
      );
   });

   it("should be defined", () => {
      expect(GetUncompletedTodosInteractor).toBeDefined();
      expect(interactor).toBeDefined();
      expect(interactor.execute).toBeDefined();
   });

   it("shoudl call execute of repository to get all uncompleted Todo", async () => {
      const verifyRepo = jest.spyOn(repository, "execute");

      await interactor.execute({ timestamp: "randomtime", input: undefined });

      expect(verifyRepo).toHaveBeenCalledTimes(1);
      expect(verifyRepo).toHaveBeenCalledWith();
      expect(verifyRepo).toHaveReturnedWith(
         Promise.resolve(allUncompletedTodosByRepoMock),
      );
   });

   it("should call present of presenter to return all uncompleted Todo", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await interactor.execute({ timestamp: "randomtime", input: undefined });

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: allUncompletedTodosByRepoMock.map((todo) => ({
            todoId: todo.getId(),
            title: todo.getTitle(),
            description: todo.getDescription(),
            dueDate: todo.getDueDate(),
            doneDate: todo.getDoneDate(),
            labels: todo.getLabels()?.map((label) => ({
               id: label.getId(),
               name: label.getName(),
               color: label.getColor() ? label.getColor() : null,
            })),
         })),
      });
   });
});
