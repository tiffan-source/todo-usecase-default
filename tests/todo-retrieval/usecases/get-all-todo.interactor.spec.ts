import { GetAllTodoInteractor } from "@todo-retrieval/usecases/get-all-todo.interactor.js";
import { allTodosByRepoMock } from "@tests/todo-retrieval/mocks/todos.mock.js";
import { jest } from "@jest/globals";
import type { GetAllTodoRepositoryOutput } from "todo-usecase";

describe("GetAllTodoInteractor", () => {
   const repository = {
      execute: jest.fn<() => Promise<GetAllTodoRepositoryOutput>>(),
   };

   const presenter = {
      present: jest.fn(),
      setCallback: jest.fn(),
   };

   const getAllTodo = new GetAllTodoInteractor(repository, presenter);

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      repository.execute = jest.fn(() => Promise.resolve(allTodosByRepoMock));
   });

   it("should be define", () => {
      expect(GetAllTodoInteractor).toBeDefined();
      expect(getAllTodo).toBeDefined();
      expect(getAllTodo.execute).toBeDefined();
   });

   it("shoudl call execute of repository to get all Todo", async () => {
      const verifyRepo = jest.spyOn(repository, "execute");

      await getAllTodo.execute({ timestamp: "randomtime", input: undefined });

      expect(verifyRepo).toHaveBeenCalledTimes(1);
      expect(verifyRepo).toHaveBeenCalledWith();
      expect(verifyRepo).toHaveReturnedWith(
         Promise.resolve(allTodosByRepoMock),
      );
   });

   it("should call present of presenter to return all Todo", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await getAllTodo.execute({ timestamp: "randomtime", input: undefined });

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: allTodosByRepoMock.map((todo) => ({
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
