import { MarkTodoAsUncompletedInteractor } from "@todo-modification/usecases/mark-todo-as-uncompleted.interactor.js";
import {
   ValidationError,
   type GetTodoByIdRepositoryOutput,
   type IGetTodoByIdRepository,
   type IMarkTodoAsUncompletedPresenter,
   type IMarkTodoAsUncompletedValidation,
   type inputDto,
   type ISaveTodoRepository,
   type MarkTodoAsUncompletedInput,
   type SaveTodoRepositoryOutput,
} from "todo-usecase";
import { outputTodoCompletedRepositoryMock } from "@tests/todo-modification/mocks/todo.mock.js";
import { jest } from "@jest/globals";

describe("MarkTodoAsUncompletedInteractor", () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   const inputTodoTest: inputDto<MarkTodoAsUncompletedInput> = {
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

   const presenter: jest.Mocked<IMarkTodoAsUncompletedPresenter> = {
      present: jest.fn(),
      setCallback: jest.fn(),
   };

   const validator: jest.Mocked<IMarkTodoAsUncompletedValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   const markTodoAsUncompleted = new MarkTodoAsUncompletedInteractor(
      validator,
      getTodoRepository,
      saveTodoRepository,
      presenter,
   );

   beforeEach(() => {
      validator.isValid = jest.fn<() => boolean>().mockReturnValue(true);
      getTodoRepository.execute = jest
         .fn<() => Promise<GetTodoByIdRepositoryOutput>>()
         .mockResolvedValue(outputTodoCompletedRepositoryMock);
      saveTodoRepository.execute = jest
         .fn<() => Promise<SaveTodoRepositoryOutput>>()
         .mockResolvedValue(outputTodoCompletedRepositoryMock);
   });

   it("should be defined", () => {
      expect(MarkTodoAsUncompletedInteractor).toBeDefined();
      expect(markTodoAsUncompleted).toBeDefined();
      expect(markTodoAsUncompleted.execute).toBeDefined();
   });

   it("should call validate to validate todo inputDTO", async () => {
      const verifyValidate = jest.spyOn(validator, "validate");
      const verifyIsValid = jest.spyOn(validator, "isValid");

      await markTodoAsUncompleted.execute(inputTodoTest);

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

   it("should call execute of get repository to get todo from db", async () => {
      const verifyRepo = jest.spyOn(getTodoRepository, "execute");

      await markTodoAsUncompleted.execute(inputTodoTest);

      expect(verifyRepo).toHaveBeenNthCalledWith(1, inputTodoTest.input.todoId);
   });

   it("should call presenter with error if todo not found", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");
      getTodoRepository.execute.mockResolvedValue(null);

      await markTodoAsUncompleted.execute(inputTodoTest);

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

   it("should call execute of save repository to save todo as uncompleted in db", async () => {
      const verifyRepo = jest.spyOn(saveTodoRepository, "execute");
      const verifyTodoUncompleted = jest.spyOn(
         outputTodoCompletedRepositoryMock,
         "resurrect",
      );

      getTodoRepository.execute.mockResolvedValueOnce(
         outputTodoCompletedRepositoryMock,
      );

      await markTodoAsUncompleted.execute(inputTodoTest);

      expect(verifyTodoUncompleted).toHaveBeenNthCalledWith(1);
      expect(verifyRepo).toHaveBeenNthCalledWith(
         1,
         outputTodoCompletedRepositoryMock,
      );
   });

   it("should call presenter with success if everything fine", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");
      const verifyTodoUncompleted = jest.spyOn(
         outputTodoCompletedRepositoryMock,
         "resurrect",
      );

      await markTodoAsUncompleted.execute(inputTodoTest);

      expect(verifyTodoUncompleted).toHaveBeenNthCalledWith(1);
      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: outputTodoCompletedRepositoryMock.getId(),
            title: outputTodoCompletedRepositoryMock.getTitle(),
            description: outputTodoCompletedRepositoryMock.getDescription(),
            doneDate: undefined,
            dueDate: outputTodoCompletedRepositoryMock.getDueDate(),
            labels: outputTodoCompletedRepositoryMock
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
