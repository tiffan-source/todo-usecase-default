import { GetTodoByIdInteractor } from "@todo-retrieval/usecases/get-todo-by-id.interactor.js";
import {
   ValidationError,
   type GetTodoByIdInput,
   type IGetTodoByIdPresenter,
   type IGetTodoByIdRepository,
   type IGetTodoByIdValidation,
   type inputDto,
} from "todo-usecase";
import { todoByIdRepoMock } from "@tests/todo-retrieval/mocks/todos.mock.js";
import { jest } from "@jest/globals";
import type { ITodo } from "todo-entity";

describe("GetTodoByIdInteractor", () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   const inputTodoTest: inputDto<GetTodoByIdInput> = {
      timestamp: "randomtime",
      input: {
         idTodo: "test-id",
      },
   };

   const mockValidation: jest.Mocked<IGetTodoByIdValidation> = {
      validate: jest.fn(),
      isValid: jest.fn(),
      getErrors: jest.fn(),
   };

   const mockRepository: jest.Mocked<IGetTodoByIdRepository> = {
      execute: jest.fn(),
   };

   const mockPresenter: jest.Mocked<IGetTodoByIdPresenter> = {
      present: jest.fn(),
   };

   const interactor = new GetTodoByIdInteractor(
      mockValidation,
      mockRepository,
      mockPresenter,
   );

   beforeEach(() => {
      mockValidation.isValid = jest.fn(() => true);
      mockRepository.execute = jest
         .fn<() => Promise<ITodo>>()
         .mockResolvedValue(todoByIdRepoMock);
   });

   it("should be defined", () => {
      expect(GetTodoByIdInteractor).toBeDefined();
      expect(interactor).toBeDefined();
      expect(interactor.execute).toBeDefined();
   });

   it("should call validate to validate todo inputDTO", async () => {
      const verifyValidate = jest.spyOn(mockValidation, "validate");
      const verifyIsValid = jest.spyOn(mockValidation, "isValid");

      await interactor.execute(inputTodoTest);

      expect(verifyValidate).toHaveBeenNthCalledWith(1, inputTodoTest);
      expect(verifyIsValid).toHaveBeenCalledTimes(1);
   });

   it("should call presenter with error if validation fails", async () => {
      const verifyPresenter = jest.spyOn(mockPresenter, "present");

      const validationError = new ValidationError("required", "idTodo");

      mockValidation.isValid.mockReturnValueOnce(false);
      mockValidation.getErrors.mockReturnValueOnce([validationError]);

      await interactor.execute(inputTodoTest);

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
      const verifyRepo = jest.spyOn(mockRepository, "execute");

      await interactor.execute(inputTodoTest);

      expect(verifyRepo).toHaveBeenNthCalledWith(1, inputTodoTest.input.idTodo);
   });

   it("should call presenter with error if todo not found", async () => {
      const verifyPresenter = jest.spyOn(mockPresenter, "present");

      mockRepository.execute.mockResolvedValueOnce(null);

      await interactor.execute(inputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "NotFound",
               message: `Todo with id ${inputTodoTest.input.idTodo} not found`,
            },
         ],
      });
   });

   it("should call presenter with error if repository throws error", async () => {
      const verifyPresenter = jest.spyOn(mockPresenter, "present");
      const repoError = new Error("Database connection failed");

      mockRepository.execute.mockRejectedValueOnce(repoError);

      await interactor.execute(inputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "Unexpected",
               message: repoError.message,
            },
         ],
      });
   });

   it("should call presenter with success and todo data if everything is fine", async () => {
      const verifyPresenter = jest.spyOn(mockPresenter, "present");

      await interactor.execute(inputTodoTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         result: {
            todoId: todoByIdRepoMock.getId(),
            title: todoByIdRepoMock.getTitle(),
            description: todoByIdRepoMock.getDescription(),
            dueDate: todoByIdRepoMock.getDueDate(),
            doneDate: todoByIdRepoMock.getDoneDate(),
            labels: todoByIdRepoMock.getLabels()?.map((label) => ({
               id: label.getId(),
               name: label.getName(),
               color: label.getColor() ? label.getColor() : null,
            })),
         },
         error: null,
      });
   });
});
