import { MarkTodoAsCompletedInteractor } from "@todo-modification/usecases/mark-todo-as-completed.interactor.js";
import {
   ValidationError,
   type GetTodoByIdRepositoryOutput,
   type IGetTodoByIdRepository,
   type IMarkTodoAsCompletedPresenter,
   type IMarkTodoAsCompletedValidation,
   type inputDto,
   type ISaveTodoRepository,
   type MarkTodoAsCompletedInput,
} from "todo-usecase";
import { outputTodoNonCompletedRepositoryMock } from "@tests/todo-modification/mocks/todo.mock.js";
import { jest } from "@jest/globals";

describe("MarkTodoAsCompletedInteractor", () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   const inputTodoTest: inputDto<MarkTodoAsCompletedInput> = {
      timestamp: "randomtime",
      input: {
         todoId: "test-id",
      },
   };

   const saveTodoRepository: jest.Mocked<ISaveTodoRepository> = {
      execute: jest.fn(),
   };

   const getTodoRepository: jest.Mocked<IGetTodoByIdRepository> = {
      execute: jest.fn(),
   };

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
      getTodoRepository,
      saveTodoRepository,
      presenter,
   );

   beforeEach(() => {
      validator.isValid = jest.fn<() => boolean>().mockReturnValue(true);
      getTodoRepository.execute = jest
         .fn<() => Promise<GetTodoByIdRepositoryOutput>>()
         .mockResolvedValue(outputTodoNonCompletedRepositoryMock);
   });

   it("should be defined", () => {
      expect(MarkTodoAsCompletedInteractor).toBeDefined();
      expect(markTodoAsCompleted).toBeDefined();
      expect(markTodoAsCompleted.execute).toBeDefined();
   });

   it("should call validate to validate todo inputDTO", async () => {
      const verifyValidate = jest.spyOn(validator, "validate");
      const verifyIsValid = jest.spyOn(validator, "isValid");

      await markTodoAsCompleted.execute(inputTodoTest);

      expect(verifyValidate).toHaveBeenNthCalledWith(1, inputTodoTest);
      expect(verifyIsValid).toHaveBeenCalledTimes(1);
   });

   it("should call presenter with error if validation fails", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      const validationError = new ValidationError(
         "todoId is required",
         "todoId",
      );

      validator.isValid.mockReturnValueOnce(false);
      validator.getErrors.mockReturnValueOnce([validationError]);

      await markTodoAsCompleted.execute(inputTodoTest);

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

   it("should call execute of get repository to get todo from db", async () => {
      const verifyRepo = jest.spyOn(getTodoRepository, "execute");

      await markTodoAsCompleted.execute(inputTodoTest);

      expect(verifyRepo).toHaveBeenNthCalledWith(1, inputTodoTest.input.todoId);
   });

   it("should call presenter with error if todo not found", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");
      getTodoRepository.execute.mockResolvedValue(null);

      await markTodoAsCompleted.execute(inputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "Unexpected",
               message: `Todo with id ${inputTodoTest.input.todoId} not found`,
            },
         ],
      });
   });

   it("should call execute of save repository to save todo as completed in db", async () => {
      const verifyRepo = jest.spyOn(saveTodoRepository, "execute");
      const verifyTodoCompleted = jest.spyOn(
         outputTodoNonCompletedRepositoryMock,
         "accomplish",
      );

      getTodoRepository.execute.mockResolvedValueOnce(
         outputTodoNonCompletedRepositoryMock,
      );

      await markTodoAsCompleted.execute(inputTodoTest);

      expect(verifyTodoCompleted).toHaveBeenNthCalledWith(1);
      expect(verifyRepo).toHaveBeenNthCalledWith(
         1,
         outputTodoNonCompletedRepositoryMock,
      );
   });

   it("should call presenter with success if everything fine", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");
      const verifyTodoCompleted = jest.spyOn(
         outputTodoNonCompletedRepositoryMock,
         "accomplish",
      );

      await markTodoAsCompleted.execute(inputTodoTest);
      expect(verifyTodoCompleted).toHaveBeenNthCalledWith(1);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: outputTodoNonCompletedRepositoryMock.getId(),
            title: outputTodoNonCompletedRepositoryMock.getTitle(),
            description: outputTodoNonCompletedRepositoryMock.getDescription(),
            doneDate: expect.any(Date), // Expect a Date instance
            dueDate: outputTodoNonCompletedRepositoryMock.getDueDate(),
            labels: outputTodoNonCompletedRepositoryMock
               .getLabels()
               ?.map((label) => ({
                  id: label.getId(),
                  name: label.getName(),
                  color: label.getColor() ? label.getColor() : null,
               })),
         },
      });
   });
});
