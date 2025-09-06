import { GetTodoByIdInteractor } from "@todo-retrieval/usecases/get-todo-by-id.interactor.js";
import {
   type GetTodoByIdInput,
   type IGetTodoByIdPresenter,
   type IGetTodoByIdValidation,
   type inputDto,
} from "todo-usecase";
import { jest } from "@jest/globals";
import { TodoRepositoryMock } from "@tests/mocks/repositories/todo.repository.mock.js";
import { LabelFactory, TodoFactory } from "todo-entity-default";

describe("GetTodoByIdInteractor", () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   const badInputTodoTest: inputDto<GetTodoByIdInput> = {
      timestamp: "randomtime",
      input: {
         idTodo: "test-id",
      },
   };

   const goodInputTodoTest: inputDto<GetTodoByIdInput> = {
      timestamp: "randomtime",
      input: {
         idTodo: "1",
      },
   };

   const mockValidation: jest.Mocked<IGetTodoByIdValidation> = {
      validate: jest.fn(),
      isValid: jest.fn(),
      getErrors: jest.fn(),
   };

   const repository = new TodoRepositoryMock(
      new TodoFactory(),
      new LabelFactory(),
   );

   const mockPresenter: jest.Mocked<IGetTodoByIdPresenter> = {
      present: jest.fn(),
   };

   const interactor = new GetTodoByIdInteractor(
      mockValidation,
      repository,
      mockPresenter,
   );

   beforeEach(() => {
      jest.clearAllMocks();
      mockValidation.isValid = jest.fn(() => true);
   });

   it("should be defined", () => {
      expect(GetTodoByIdInteractor).toBeDefined();
      expect(interactor).toBeDefined();
      expect(interactor.execute).toBeDefined();
   });

   it("should call presenter with error if todo not found", async () => {
      const verifyPresenter = jest.spyOn(mockPresenter, "present");

      await interactor.execute(badInputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "NotFound",
               message: `Todo with id ${badInputTodoTest.input.idTodo} not found`,
            },
         ],
      });
   });

   it("should call presenter with success and todo data if everything is fine", async () => {
      const verifyPresenter = jest.spyOn(mockPresenter, "present");

      await interactor.execute(goodInputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         result: expect.objectContaining({
            todoId: "1",
         }),
         error: null,
      });
   });
});
