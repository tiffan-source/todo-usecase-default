import { MarkTodoAsUncompletedInteractor } from "@todo-modification/usecases/mark-todo-as-uncompleted.interactor.js";
import {
   ValidationError,
   type IGetTodoByIdRepository,
   type IMarkTodoAsUncompletedPresenter,
   type IMarkTodoAsUncompletedValidation,
   type inputDto,
   type ISaveTodoRepository,
   type MarkTodoAsUncompletedInput,
} from "todo-usecase";
import { outputTodoCompletedRepositoryMock } from "@tests/todo-modification/mocks/todo.mock.js";
import { jest } from "@jest/globals";
import { GetTodoByIdRepositoryMock } from "@tests/mocks/get-todo-by-id-repository.mock.js";
import { SaveTodoRepositoryMock } from "@tests/mocks/save-todo-repository.mock.js";

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

   const saveTodoRepository: ISaveTodoRepository = new SaveTodoRepositoryMock();

   const getTodoRepository: IGetTodoByIdRepository =
      new GetTodoByIdRepositoryMock();

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
      getTodoRepository,
      saveTodoRepository,
      presenter,
   );

   beforeEach(() => {
      jest.clearAllMocks();
      validator.isValid = jest.fn<() => boolean>().mockReturnValue(true);
      jest
         .spyOn(getTodoRepository, "getTodoById")
         .mockResolvedValue(outputTodoCompletedRepositoryMock);
      jest
         .spyOn(saveTodoRepository, "saveTodo")
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
      const verifyRepo = jest.spyOn(getTodoRepository, "getTodoById");

      await markTodoAsUncompleted.execute(inputTodoTest);

      expect(verifyRepo).toHaveBeenNthCalledWith(1, inputTodoTest.input.todoId);
   });

   it("should call presenter with error if todo not found", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");
      jest.spyOn(getTodoRepository, "getTodoById").mockResolvedValue(null);

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
      const verifyRepo = jest.spyOn(saveTodoRepository, "saveTodo");
      const verifyTodoUncompleted = jest.spyOn(
         outputTodoCompletedRepositoryMock,
         "resurrect",
      );

      jest
         .spyOn(getTodoRepository, "getTodoById")
         .mockResolvedValueOnce(outputTodoCompletedRepositoryMock);

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

   it("should map todos with labels correctly", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await markTodoAsUncompleted.execute(inputTodoTest);

      expect(verifyPresenter).toHaveBeenCalledWith({
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
