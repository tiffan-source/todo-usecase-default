import { GetAllTodoInteractor } from "@todo-retrieval/usecases/get-all-todo.interactor.js";
import { allTodosByRepoMock } from "@tests/todo-retrieval/mocks/todos.mock.js";
import { jest } from "@jest/globals";
import {
   ValidationError,
   type GetAllTodoRepositoryOutput,
   type IGetAllTodoValidation,
} from "todo-usecase";

describe("GetAllTodoInteractor", () => {
   const validation: jest.Mocked<IGetAllTodoValidation> = {
      validate: jest.fn(),
      isValid: jest.fn(),
      getErrors: jest.fn(),
   };

   const repository = {
      execute: jest.fn<() => Promise<GetAllTodoRepositoryOutput>>(),
   };

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
      repository.execute = jest.fn(() => Promise.resolve(allTodosByRepoMock));
   });

   it("should be define", () => {
      expect(GetAllTodoInteractor).toBeDefined();
      expect(getAllTodo).toBeDefined();
      expect(getAllTodo.execute).toBeDefined();
   });

   it("should call validate to validate todo inputDTO", async () => {
      const verifyValidate = jest.spyOn(validation, "validate");
      const verifyIsValid = jest.spyOn(validation, "isValid");

      await getAllTodo.execute({ timestamp: "randomtime", input: {} });

      expect(verifyValidate).toHaveBeenNthCalledWith(1, {
         timestamp: "randomtime",
         input: {},
      });
      expect(verifyIsValid).toHaveBeenCalledTimes(1);
   });

   it("it should call present with error if validator return error", async () => {
      const verify = jest.spyOn(presenter, "present");

      const validationError = new ValidationError(
         "invalid_key",
         `filters.notAllowed`,
         `Unexpected filter key: notAllowed`,
      );

      validation.isValid.mockReturnValue(false);
      validation.getErrors.mockReturnValue([validationError]);

      await getAllTodo.execute({
         timestamp: "randomtime",
         input: {
            filters: {
               notAllowed: "value",
            } as object,
         },
      });

      expect(verify).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "ValidationError",
               message: validationError.toString(),
            },
         ],
      });
   });

   it("should call execute of repository to get all Todo", async () => {
      const verifyRepo = jest.spyOn(repository, "execute");

      await getAllTodo.execute({ timestamp: "randomtime", input: {} });

      expect(verifyRepo).toHaveBeenCalledTimes(1);
      expect(verifyRepo).toHaveBeenCalledWith({
         filters: {
            done: undefined,
            dueDate: undefined,
         },
      });
      expect(verifyRepo).toHaveReturnedWith(
         Promise.resolve(allTodosByRepoMock),
      );
   });

   it("should call present of presenter to return all Todo", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await getAllTodo.execute({ timestamp: "randomtime", input: {} });

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
