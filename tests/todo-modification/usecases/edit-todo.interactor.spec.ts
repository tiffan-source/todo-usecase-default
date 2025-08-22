import {
   type EditTodoInput,
   type ICheckLabelExistRepository,
   type ICreateLabelRepository,
   type IEditTodoPresenter,
   type IEditTodoValidation,
   type IGetLabelByIdRepository,
   type IGetTodoByIdRepository,
   type ISaveTodoRepository,
   type inputDto,
   ValidationError,
} from "todo-usecase";
import { EditTodoInteractor } from "@todo-modification/usecases/edit-todo.interactor.js";
import { jest } from "@jest/globals";
import type { ILabel, ILabelFactory, ITodo } from "todo-entity";
import { fakeTodoToEdit } from "@tests/todo-modification/mocks/todo.mock.js";
import { GetTodoByIdRepositoryMock } from "@tests/mocks/get-todo-by-id-repository.mock.js";
import { CheckLabelExistRepositoryMock } from "@tests/mocks/check-label-exist-repository.mock.js";
import { CreateLabelRepositoryMock } from "@tests/mocks/create-label-repository.mock.js";
import { GetLabelByIdRepositoryMock } from "@tests/mocks/get-label-by-id-repository.mock.js";
import { SaveTodoRepositoryMock } from "@tests/mocks/save-todo-repository.mock.js";

describe("EditTodoInteractor", () => {
   const validation: jest.Mocked<IEditTodoValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   const getTodoRepository: IGetTodoByIdRepository =
      new GetTodoByIdRepositoryMock();

   const checkLabelRepository: ICheckLabelExistRepository =
      new CheckLabelExistRepositoryMock();

   const createLabelRepository: ICreateLabelRepository =
      new CreateLabelRepositoryMock();

   const getLabelRepository: IGetLabelByIdRepository =
      new GetLabelByIdRepositoryMock();

   const saveTodoRepository: ISaveTodoRepository = new SaveTodoRepositoryMock();

   const presenter: jest.Mocked<IEditTodoPresenter> = {
      present: jest.fn(),
   };

   const labelFactory: jest.Mocked<ILabelFactory> = {
      create: jest.fn(),
      createWithId: jest.fn(),
   };

   const interactor = new EditTodoInteractor(
      validation,
      getTodoRepository,
      checkLabelRepository,
      createLabelRepository,
      getLabelRepository,
      saveTodoRepository,
      presenter,
      labelFactory,
   );

   const input: inputDto<EditTodoInput> = {
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

   beforeEach(() => {
      jest.clearAllMocks();
      validation.isValid.mockReturnValue(true);
      jest
         .spyOn(getTodoRepository, "getTodoById")
         .mockResolvedValue(fakeTodoToEdit);
      jest
         .spyOn(saveTodoRepository, "saveTodo")
         .mockResolvedValue(fakeTodoToEdit);
   });

   it("should call validation and isValid", async () => {
      await interactor.execute(input);
      expect(validation.validate).toHaveBeenCalledWith(input);
      expect(validation.isValid).toHaveBeenCalled();
   });

   it("should return validation error if input is invalid", async () => {
      const error = new ValidationError("Missing title", "title");
      validation.isValid.mockReturnValue(false);
      validation.getErrors.mockReturnValue([error]);

      await interactor.execute(input);

      expect(presenter.present).toHaveBeenCalledWith({
         success: false,
         error: [
            {
               type: "ValidationError",
               message: error.toString(),
            },
         ],
      });
   });

   it("should return not found error if todo doesn't exist", async () => {
      jest.spyOn(getTodoRepository, "getTodoById").mockResolvedValue(null);

      await interactor.execute(input);

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
      await interactor.execute(input);

      expect(fakeTodoToEdit.modifyTitle).toHaveBeenCalledWith("new title");
      expect(fakeTodoToEdit.describe).toHaveBeenCalledWith("new desc");
      expect(fakeTodoToEdit.addDeadline).toHaveBeenCalledWith(
         input.input.newData.dueDate,
      );
   });

   it("should remove labels not in labelIds", async () => {
      input.input.newData.labelIds = ["label2"];

      await interactor.execute(input);

      expect(fakeTodoToEdit.removeLabel).toHaveBeenCalledTimes(1);
   });

   it("should create and add new label if not exists", async () => {
      const newLabelMock: jest.Mocked<ILabel> = {
         getId: jest.fn(),
         getName: jest.fn(),
         getColor: jest.fn(),
         setColor: jest.fn(),
         setName: jest.fn(),
      };
      jest
         .spyOn(checkLabelRepository, "checkLabelExists")
         .mockResolvedValue(false);
      labelFactory.create.mockReturnValue(newLabelMock);
      jest
         .spyOn(createLabelRepository, "createLabel")
         .mockResolvedValue(newLabelMock);

      await interactor.execute(input);

      expect(checkLabelRepository.checkLabelExists).toHaveBeenCalledWith(
         "urgent",
      );
      expect(createLabelRepository.createLabel).toHaveBeenCalledTimes(1);
      expect(fakeTodoToEdit.addLabel).toHaveBeenCalledTimes(1);
   });

   it("should get and add existing label by ID", async () => {
      const existingLabel: jest.Mocked<ILabel> = {
         getId: jest.fn(),
         getName: jest.fn(),
         getColor: jest.fn(),
         setColor: jest.fn(),
         setName: jest.fn(),
      };
      input.input.newData.labelIds = ["label3"];
      jest
         .spyOn(getLabelRepository, "getLabelById")
         .mockResolvedValue(existingLabel);
      input.input.newData.newLabelTitles = [];
      jest
         .spyOn(getLabelRepository, "getLabelById")
         .mockResolvedValue(existingLabel);

      await interactor.execute(input);

      expect(getLabelRepository.getLabelById).toHaveBeenCalledWith("label3");
      expect(fakeTodoToEdit.addLabel).toHaveBeenCalledTimes(1);
   });

   it("should call saveTodoRepository and presenter with updated todo", async () => {
      input.input.newData.labelIds = [];
      input.input.newData.newLabelTitles = [];

      const updatedTodo: jest.Mocked<ITodo> = {
         getId: jest.fn<() => string>().mockReturnValue("123"),
         getTitle: jest.fn<() => string>().mockReturnValue("new title"),
         getDescription: jest.fn<() => string>().mockReturnValue("new desc"),
         getDoneDate: jest.fn(),
         getDueDate: jest
            .fn<() => Date>()
            .mockReturnValue(new Date("2025-01-01")),
         getLabels: jest.fn(),
         modifyTitle: jest.fn(),
         describe: jest.fn(),
         addDeadline: jest.fn(),
         removeLabel: jest.fn(),
         addLabel: jest.fn(),
         accomplish: jest.fn(),
         resurrect: jest.fn(),
         reportDeadline: jest.fn(),
      };

      jest.spyOn(saveTodoRepository, "saveTodo").mockResolvedValue(updatedTodo);

      await interactor.execute(input);

      expect(saveTodoRepository.saveTodo).toHaveBeenCalledTimes(1);

      expect(presenter.present).toHaveBeenCalledWith({
         success: true,
         result: {
            todoId: updatedTodo.getId(),
            title: updatedTodo.getTitle(),
            description: updatedTodo.getDescription(),
            doneDate: updatedTodo.getDoneDate(),
            dueDate: updatedTodo.getDueDate(),
            labels: updatedTodo.getLabels()?.map((label) => ({
               id: label.getId(),
               name: label.getName(),
               color: label.getColor() ? label.getColor() : null,
            })),
         },
         error: null,
      });
   });

   it("should return error if unexpected error occurs", async () => {
      const error = new Error("Unexpected failure");
      jest.spyOn(getTodoRepository, "getTodoById").mockRejectedValueOnce(error);

      await interactor.execute(input);

      expect(presenter.present).toHaveBeenCalledWith({
         success: false,
         error: [
            {
               type: "Unexpected",
               message: error.message,
            },
         ],
      });
   });

   it("should return undefined", async () => {
      const result = await interactor.execute(input);
      expect(result).toBeUndefined();
   });
});
