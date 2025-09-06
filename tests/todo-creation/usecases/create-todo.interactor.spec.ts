import {
   ValidationError,
   type CreateTodoInput,
   type ICreateTodoPresenter,
   type ICreateTodoValidation,
   type inputDto,
} from "todo-usecase";
import { jest } from "@jest/globals";
import type { ILabel, ILabelFactory, ITodoFactory } from "todo-entity";
import { CreateTodoInteractor } from "@todo-creation/usecases/create-todo.interactor.js";
import { TodoRepositoryMock } from "@tests/mocks/repositories/todo.repository.mock.js";
import { LabelRepositoryMock } from "@tests/mocks/repositories/label.repository.mock.js";
import { LabelFactory, TodoFactory } from "todo-entity-default";

describe("CreateTodoInteractor", () => {
   const todoFactory: ITodoFactory = new TodoFactory();
   const labelFactory: ILabelFactory = new LabelFactory();
   const todoRepository = new TodoRepositoryMock(todoFactory, labelFactory);
   const labelRepository = new LabelRepositoryMock(labelFactory);

   const presenter: jest.Mocked<ICreateTodoPresenter> = {
      present: jest.fn(),
   };

   const validator: jest.Mocked<ICreateTodoValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   const createTodo = new CreateTodoInteractor(
      validator,
      todoRepository,
      labelRepository,
      labelRepository,
      labelRepository,
      presenter,
      todoFactory,
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
         newLabelTitles: ["non-existing-label"],
      },
   };

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      validator.isValid = jest.fn<() => boolean>().mockReturnValue(true);
   });

   it("should be define", () => {
      expect(CreateTodoInteractor).toBeDefined();
      expect(createTodo).toBeDefined();
      expect(createTodo.execute).toBeDefined();
   });

   it("should call presenter to return todo with labels", async () => {
      const verify = jest.spyOn(presenter, "present");

      await createTodo.execute(inputTodoWithNonExistingLabelTest);

      expect(verify).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: expect.any(String),
            title: inputTodoWithNonExistingLabelTest.input.title,
            description: inputTodoWithNonExistingLabelTest.input.description,
            doneDate: undefined,
            dueDate: inputTodoWithNonExistingLabelTest.input.dueDate,
            labels: expect.arrayContaining([
               expect.objectContaining({ name: "non-existing-label" }),
            ]),
         },
      });
   });

   it("should call presenter to return todo", async () => {
      const verify = jest.spyOn(presenter, "present");

      await createTodo.execute(inputTodoTest);

      expect(verify).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: expect.any(String),
            title: inputTodoTest.input.title,
            description: inputTodoTest.input.description,
            doneDate: undefined,
            dueDate: inputTodoTest.input.dueDate,
            labels: expect.any(Array<ILabel>),
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

   it("it should return undefined", async () => {
      const result = await createTodo.execute(inputTodoTest);
      expect(result).toBeUndefined();
   });
});
