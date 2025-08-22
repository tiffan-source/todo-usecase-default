import {
   ValidationError,
   type CreateTodoInput,
   type ICheckLabelExistRepository,
   type ICreateLabelRepository,
   type ICreateTodoPresenter,
   type ICreateTodoRepository,
   type ICreateTodoValidation,
   type IGetLabelByIdRepository,
   type inputDto,
} from "todo-usecase";
import { jest } from "@jest/globals";
import type { ILabel, ILabelFactory, ITodoFactory } from "todo-entity";
import { CreateTodoInteractor } from "@todo-creation/usecases/create-todo.interactor.js";
import {
   inputTodoMock,
   outputTodoRepositoryMock,
} from "@tests/todo-creation/mocks/todo.mock.js";
import { nonExistingLabelMock } from "@tests/todo-creation/mocks/label.mock.js";
import { CreateTodoRepositoryMock } from "@tests/mocks/create-todo-repository.mock.js";
import { CreateLabelRepositoryMock } from "@tests/mocks/create-label-repository.mock.js";
import { CheckLabelExistRepositoryMock } from "@tests/mocks/check-label-exist-repository.mock.js";
import { GetLabelByIdRepositoryMock } from "@tests/mocks/get-label-by-id-repository.mock.js";

describe("CreateTodoInteractor", () => {
   const createTodoRepo: ICreateTodoRepository = new CreateTodoRepositoryMock();

   const createLabelRepo: ICreateLabelRepository =
      new CreateLabelRepositoryMock();

   const checkLabelRepo: ICheckLabelExistRepository =
      new CheckLabelExistRepositoryMock();

   const getLabelByIdRepo: IGetLabelByIdRepository =
      new GetLabelByIdRepositoryMock();

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
      createWithId: jest.fn(),
   };

   const labelFactory: jest.Mocked<ILabelFactory> = {
      create: jest.fn(),
      createWithId: jest.fn(),
   };

   const createTodo = new CreateTodoInteractor(
      validator,
      createTodoRepo,
      createLabelRepo,
      checkLabelRepo,
      getLabelByIdRepo,
      presenter,
      todoInput,
      labelFactory,
   );

   const inputTodoTest: inputDto<CreateTodoInput> = {
      timestamp: "randomtime",
      input: {
         title: "test title",
         description: "test description",
         dueDate: new Date("2023-10-01T00:00:00Z"),
      },
   };

   const inputTodoWithNonExistingLabelTest: inputDto<CreateTodoInput> = {
      timestamp: "randomtime",
      input: {
         title: "test title",
         description: "test description",
         labelIds: ["1", "2"],
         newLabelTitles: ["existing-label", "non-existing-label"],
      },
   };

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      validator.isValid = jest.fn<() => boolean>().mockReturnValue(true);
      todoInput.create = jest.fn().mockReturnValue(inputTodoMock);
      labelFactory.create = jest.fn().mockReturnValue(nonExistingLabelMock);
   });

   it("should be define", () => {
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

   it("should call execute of createTodoRepo to save todo create in db", async () => {
      const verifyRepo = jest.spyOn(createTodoRepo, "createTodo");

      inputTodoMock.getTitle.mockReturnValue(inputTodoTest.input.title);
      inputTodoMock.getDescription.mockReturnValue(
         inputTodoTest.input.description as string,
      );

      await createTodo.execute(inputTodoTest);

      expect(verifyRepo).toHaveBeenNthCalledWith(1, inputTodoMock);
   });

   it("should call checkLabelRepository if newLabelTitles is provided", async () => {
      const verifyCheckLabel = jest.spyOn(checkLabelRepo, "checkLabelExists");

      await createTodo.execute(inputTodoWithNonExistingLabelTest);

      const titles = inputTodoWithNonExistingLabelTest.input.newLabelTitles;

      expect(verifyCheckLabel).toHaveBeenCalledWith(titles?.[0]);
      expect(verifyCheckLabel).toHaveBeenCalledWith(titles?.[1]);
   });

   it("should call createLabelRepository if newLabelTitles is provided only for non existing label", async () => {
      const verifyCreateLabel = jest.spyOn(createLabelRepo, "createLabel");

      await createTodo.execute(inputTodoWithNonExistingLabelTest);

      labelFactory.create.mockReturnValue(nonExistingLabelMock);
      expect(verifyCreateLabel).toHaveBeenNthCalledWith(
         1,
         nonExistingLabelMock,
      );
      expect(verifyCreateLabel).toHaveBeenCalledTimes(1);
   });

   it("should call presenter to return todo with labels", async () => {
      const verify = jest.spyOn(presenter, "present");

      outputTodoRepositoryMock.getTitle.mockReturnValue("test title");
      outputTodoRepositoryMock.getDescription.mockReturnValue(
         "test description",
      );

      outputTodoRepositoryMock.getLabels.mockReturnValue([
         {
            getId: jest.fn<() => string>().mockReturnValue("1"),
            getName: jest.fn<() => string>().mockReturnValue("existing-label"),
            getColor: jest.fn<() => string>(),
            setColor: jest.fn<(color: string) => string>(),
            setName: jest.fn<(name: string) => string>(),
         },
         {
            getId: jest.fn<() => string>().mockReturnValue("2"),
            getName: jest.fn<() => string>().mockReturnValue("existing-label"),
            getColor: jest.fn<() => string>(),
            setColor: jest.fn<(color: string) => string>(),
            setName: jest.fn<(name: string) => string>(),
         },
         {
            getId: jest
               .fn<() => string>()
               .mockReturnValue("non-existing-label-id"),
            getName: jest
               .fn<() => string>()
               .mockReturnValue("non-existing-label"),
            getColor: jest.fn<() => string>(),
            setColor: jest.fn<(color: string) => string>(),
            setName: jest.fn<(name: string) => string>(),
         },
      ]);
      jest
         .spyOn(createTodoRepo, "createTodo")
         .mockResolvedValue(outputTodoRepositoryMock);

      await createTodo.execute(inputTodoWithNonExistingLabelTest);

      expect(verify).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: outputTodoRepositoryMock.getId(),
            title: outputTodoRepositoryMock.getTitle(),
            description: outputTodoRepositoryMock.getDescription(),
            doneDate: outputTodoRepositoryMock.getDoneDate(),
            dueDate: outputTodoRepositoryMock.getDueDate(),
            labels: [
               {
                  id: "1",
                  name: "existing-label",
                  color: undefined,
               },
               {
                  id: "2",
                  name: "existing-label",
                  color: undefined,
               },
               {
                  id: "non-existing-label-id",
                  name: "non-existing-label",
                  color: undefined,
               },
            ],
         },
      });
   });

   it("should call presenter to return todo", async () => {
      const verify = jest.spyOn(presenter, "present");

      jest
         .spyOn(createTodoRepo, "createTodo")
         .mockResolvedValue(outputTodoRepositoryMock);

      await createTodo.execute(inputTodoTest);

      expect(verify).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: outputTodoRepositoryMock.getId(),
            title: outputTodoRepositoryMock.getTitle(),
            description: outputTodoRepositoryMock.getDescription(),
            doneDate: outputTodoRepositoryMock.getDoneDate(),
            dueDate: outputTodoRepositoryMock.getDueDate(),
            labels: outputTodoRepositoryMock
               .getLabels()
               .map((label: ILabel) => ({
                  id: label.getId(),
                  name: label.getName(),
                  color: label.getColor(),
               })),
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

   it("it should call present with error if execute of createTodoRepo return error", async () => {
      const verify = jest.spyOn(presenter, "present");
      const repoError = new Error("Erreur lors de l'enregistrement");

      jest.spyOn(createTodoRepo, "createTodo").mockRejectedValue(repoError);

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

   it("it should return undefined", async () => {
      const result = await createTodo.execute(inputTodoTest);
      expect(result).toBeUndefined();
   });
});
