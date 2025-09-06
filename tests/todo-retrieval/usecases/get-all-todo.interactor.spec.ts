import { GetAllTodoInteractor } from "@todo-retrieval/usecases/get-all-todo.interactor.js";

import { jest } from "@jest/globals";
import { type IGetAllTodoValidation } from "todo-usecase";
import { TodoRepositoryMock } from "@tests/mocks/repositories/todo.repository.mock.js";
import { LabelFactory, TodoFactory } from "todo-entity-default";

describe("GetAllTodoInteractor", () => {
   const validation: jest.Mocked<IGetAllTodoValidation> = {
      validate: jest.fn(),
      isValid: jest.fn(),
      getErrors: jest.fn(),
   };

   const repository = new TodoRepositoryMock(
      new TodoFactory(),
      new LabelFactory(),
   );

   const presenter = {
      present: jest.fn(),
      setCallback: jest.fn(),
   };

   const getAllTodo = new GetAllTodoInteractor(
      validation,
      repository,
      presenter,
   );

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      validation.isValid = jest.fn<() => boolean>().mockReturnValue(true);
   });

   it("should be define", () => {
      expect(GetAllTodoInteractor).toBeDefined();
      expect(getAllTodo).toBeDefined();
      expect(getAllTodo.execute).toBeDefined();
   });

   it("should call present of presenter to return all Todo", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await getAllTodo.execute({ timestamp: "randomtime", input: {} });

      expect(verifyPresenter).toHaveBeenCalledWith({
         success: true,
         error: null,
         result: expect.any(Array),
      });
   });
});
