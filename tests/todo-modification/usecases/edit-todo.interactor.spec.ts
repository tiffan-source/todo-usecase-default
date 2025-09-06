import {
   type EditTodoInput,
   type IEditTodoInteractor,
   type IEditTodoPresenter,
   type IEditTodoValidation,
   type inputDto,
} from "todo-usecase";
import { EditTodoInteractor } from "@todo-modification/usecases/edit-todo.interactor.js";
import { jest } from "@jest/globals";
import type { ILabelFactory } from "todo-entity";
import { LabelRepositoryMock } from "@tests/mocks/repositories/label.repository.mock.js";
import { TodoRepositoryMock } from "@tests/mocks/repositories/todo.repository.mock.js";
import { LabelFactory, TodoFactory } from "todo-entity-default";

describe("EditTodoInteractor", () => {
   const validation: jest.Mocked<IEditTodoValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   let todoRepository;

   let labelRepository;

   const presenter: jest.Mocked<IEditTodoPresenter> = {
      present: jest.fn(),
   };

   const labelFactory: ILabelFactory = new LabelFactory();

   let interactor: IEditTodoInteractor;

   const badInput: inputDto<EditTodoInput> = {
      timestamp: "ts",
      input: {
         todoId: "123",
         newData: {
            title: "new title",
            description: "new desc",
            dueDate: new Date("2025-01-01"),
            labelIds: ["label1", "label3"],
            newLabelTitles: ["urgent"],
         },
      },
   };

   const input: inputDto<EditTodoInput> = {
      timestamp: "ts",
      input: {
         todoId: "1",
         newData: {
            title: "new title",
            description: "new desc",
            dueDate: new Date("2025-01-01"),
            labelIds: ["label1", "label3"],
            newLabelTitles: ["urgent"],
         },
      },
   };

   beforeEach(() => {
      jest.clearAllMocks();
      validation.isValid.mockReturnValue(true);

      todoRepository = new TodoRepositoryMock(
         new TodoFactory(),
         new LabelFactory(),
      );
      labelRepository = new LabelRepositoryMock(labelFactory);

      interactor = new EditTodoInteractor(
         validation,
         todoRepository,
         labelRepository,
         labelRepository,
         labelRepository,
         todoRepository,
         presenter,
         labelFactory,
      );
   });

   it("should call validation and isValid", async () => {
      await interactor.execute(input);
      expect(validation.validate).toHaveBeenCalledWith(input);
      expect(validation.isValid).toHaveBeenCalled();
   });

   it("should return not found error if todo doesn't exist", async () => {
      await interactor.execute(badInput);

      expect(presenter.present).toHaveBeenCalledWith({
         success: false,
         error: [
            {
               type: "NotFoundError",
               message: "Todo with id 123 not found",
            },
         ],
      });
   });

   it("should update todo with new title, description and deadline", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await interactor.execute(input);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            todoId: input.input.todoId,
            title: input.input.newData.title,
            description: input.input.newData.description,
            doneDate: undefined,
            dueDate: input.input.newData.dueDate,
            labels: expect.arrayContaining([
               expect.objectContaining({ name: "urgent" }),
            ]),
         },
      });
   });

   it("should return undefined", async () => {
      const result = await interactor.execute(input);
      expect(result).toBeUndefined();
   });
});
