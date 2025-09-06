import { MarkTodoAsCompletedInteractor } from "@todo-modification/usecases/mark-todo-as-completed.interactor.js";
import {
   type IMarkTodoAsCompletedPresenter,
   type IMarkTodoAsCompletedValidation,
   type inputDto,
   type MarkTodoAsCompletedInput,
} from "todo-usecase";
import { jest } from "@jest/globals";
import { TodoRepositoryMock } from "@tests/mocks/repositories/todo.repository.mock.js";
import { LabelFactory, TodoFactory } from "todo-entity-default";

describe("MarkTodoAsCompletedInteractor", () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   const inputTodoTest: inputDto<MarkTodoAsCompletedInput> = {
      timestamp: "randomtime",
      input: {
         todoId: "1",
      },
   };

   const todoRepository = new TodoRepositoryMock(
      new TodoFactory(),
      new LabelFactory(),
   );

   const presenter: jest.Mocked<IMarkTodoAsCompletedPresenter> = {
      present: jest.fn(),
   };

   const validator: jest.Mocked<IMarkTodoAsCompletedValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   const markTodoAsCompleted = new MarkTodoAsCompletedInteractor(
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
      expect(MarkTodoAsCompletedInteractor).toBeDefined();
      expect(markTodoAsCompleted).toBeDefined();
      expect(markTodoAsCompleted.execute).toBeDefined();
   });

   it("should call presenter with error if todo not found", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      const badInput: inputDto<MarkTodoAsCompletedInput> = {
         timestamp: "randomtime",
         input: {
            todoId: "non-existing-id",
         },
      };

      await markTodoAsCompleted.execute(badInput);

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

      await markTodoAsCompleted.execute(inputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: inputTodoTest.input.todoId,
            title: expect.any(String),
            description: expect.any(String),
            doneDate: expect.any(Date), // Expect a Date instance
            dueDate: expect.any(Date), // Expect a Date instance
            labels: expect.any(Array),
         },
      });
   });
});
