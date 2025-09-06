import { MarkTodoAsUncompletedInteractor } from "@todo-modification/usecases/mark-todo-as-uncompleted.interactor.js";
import {
   ValidationError,
   type IMarkTodoAsUncompletedPresenter,
   type IMarkTodoAsUncompletedValidation,
   type inputDto,
   type MarkTodoAsUncompletedInput,
} from "todo-usecase";
import { jest } from "@jest/globals";
import { TodoRepositoryMock } from "@tests/mocks/repositories/todo.repository.mock.js";
import { LabelFactory, TodoFactory } from "todo-entity-default";

describe("MarkTodoAsUncompletedInteractor", () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   const inputTodoTest: inputDto<MarkTodoAsUncompletedInput> = {
      timestamp: "randomtime",
      input: {
         todoId: "2",
      },
   };

   const todoRepository = new TodoRepositoryMock(
      new TodoFactory(),
      new LabelFactory(),
   );

   const presenter: jest.Mocked<IMarkTodoAsUncompletedPresenter> = {
      present: jest.fn(),
   };

   const validator: jest.Mocked<IMarkTodoAsUncompletedValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   const markTodoAsUncompleted = new MarkTodoAsUncompletedInteractor(
      validator,
      todoRepository,
      todoRepository,
      presenter,
   );

   beforeEach(() => {
      jest.clearAllMocks();
      validator.isValid = jest.fn<() => boolean>().mockReturnValue(true);
   });

   it("should be defined", () => {
      expect(MarkTodoAsUncompletedInteractor).toBeDefined();
      expect(markTodoAsUncompleted).toBeDefined();
      expect(markTodoAsUncompleted.execute).toBeDefined();
   });

   it("should call presenter with error if validation fails", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      const validationError = new ValidationError(
         "todoId is required",
         "todoId",
      );

      validator.isValid.mockReturnValueOnce(false);
      validator.getErrors.mockReturnValueOnce([validationError]);

      await markTodoAsUncompleted.execute(inputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "ValidationError",
               message: validationError.toString(),
            },
         ],
      });
   });

   it("should call presenter with error if todo not found", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      const badInput = {
         timestamp: "randomtime",
         input: {
            todoId: "non-existing-id",
         },
      };

      await markTodoAsUncompleted.execute(badInput);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "Unexpected",
               message: `Todo with id ${badInput.input.todoId} not found`,
            },
         ],
      });
   });

   it("should call presenter with success if everything fine", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await markTodoAsUncompleted.execute(inputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: inputTodoTest.input.todoId,
            title: expect.any(String),
            description: expect.any(String),
            doneDate: undefined,
            dueDate: expect.any(Date),
            labels: expect.any(Array),
         },
      });
   });
});
