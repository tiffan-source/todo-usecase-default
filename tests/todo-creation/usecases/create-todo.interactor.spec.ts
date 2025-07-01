import {
   ValidationError,
   type CreateTodoInput,
   type CreateTodoRepositoryInput,
   type CreateTodoRepositoryOutput,
   type ICreateTodoPresenter,
   type ICreateTodoRepository,
   type ICreateTodoValidation,
   type inputDto,
} from "todo-usecase";
import { jest } from "@jest/globals";
import type { ITodoFactory } from "todo-entity";
import { CreateTodoInteractor } from "@todo-creation/usecases/create-todo.interactor.js";
import {
   inputTodoMock,
   outputTodoRepositoryMock,
} from "@tests/todo-creation/mocks/todo.mock.js";

describe("CreateTodoInteractor", () => {
   const repository: jest.Mocked<ICreateTodoRepository> = {
      execute:
         jest.fn<
            (
               input: CreateTodoRepositoryInput,
            ) => Promise<CreateTodoRepositoryOutput>
         >(),
   };

   const presenter: jest.Mocked<ICreateTodoPresenter> = {
      present: jest.fn(),
   };

   const validator: jest.Mocked<ICreateTodoValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   const todoInput: jest.Mocked<ITodoFactory> = {
      create: jest.fn(),
   };

   const createTodo = new CreateTodoInteractor(
      validator,
      repository,
      presenter,
      todoInput,
   );

   const inputTodoTest: inputDto<CreateTodoInput> = {
      timestamp: "randomtime",
      input: {
         title: "test title",
         description: "test description",
      },
   };

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      validator.isValid = jest.fn<() => boolean>().mockReturnValue(true);
      todoInput.create = jest.fn().mockReturnValue(inputTodoMock);
   });

   it("shoudl be define", () => {
      expect(CreateTodoInteractor).toBeDefined();
      expect(createTodo).toBeDefined();
      expect(createTodo.execute).toBeDefined();
   });

   it("should call validate to validate todo inputDTO", async () => {
      const verifyValidate = jest.spyOn(validator, "validate");
      const verifyIsValid = jest.spyOn(validator, "isValid");

      await createTodo.execute(inputTodoTest);

      expect(verifyValidate).toHaveBeenNthCalledWith(1, inputTodoTest);
      expect(verifyIsValid).toHaveBeenCalledTimes(1);
   });

   it("should call execute of repository to save todo create in db", async () => {
      const verifyRepo = jest.spyOn(repository, "execute");

      inputTodoMock.getTitle.mockReturnValue(inputTodoTest.input.title);
      inputTodoMock.getDescription.mockReturnValue(
         inputTodoTest.input.description as string,
      );

      await createTodo.execute(inputTodoTest);

      expect(verifyRepo).toHaveBeenNthCalledWith(1, inputTodoMock);
   });

   it("should call presenter to return todo", async () => {
      const verify = jest.spyOn(presenter, "present");

      repository.execute.mockResolvedValue(outputTodoRepositoryMock);

      await createTodo.execute(inputTodoTest);

      expect(verify).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: outputTodoRepositoryMock.getId(),
            title: outputTodoRepositoryMock.getTitle(),
            description: outputTodoRepositoryMock.getDescription(),
         },
      });
   });

   it("it should call present with error if validator return error", async () => {
      const verify = jest.spyOn(presenter, "present");

      const validationError = new ValidationError("title unvalid", "title");

      validator.isValid.mockReturnValue(false);
      validator.getErrors.mockReturnValue([validationError]);

      await createTodo.execute(inputTodoTest);

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

   it("it shoudl call present with error if execute of repository return error", async () => {
      const verify = jest.spyOn(presenter, "present");
      const repoError = new Error("Erreur lors de l'enregistrement");

      repository.execute.mockRejectedValue(repoError);

      await createTodo.execute(inputTodoTest);

      expect(verify).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "Unexpected",
               message: repoError.message,
            },
         ],
      });
   });

   it("it should return undefine", async () => {
      const result = await createTodo.execute(inputTodoTest);
      expect(result).toBeUndefined();
   });
});
