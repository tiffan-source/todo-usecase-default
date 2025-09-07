import { GetAllTodoInteractor } from "@todo-retrieval/usecases/get-all-todo.interactor.js";

import { jest } from "@jest/globals";
import {
   type IGetAllTodoPresenter,
   type IGetAllTodoValidation,
} from "todo-usecase";
import { TodoRepositoryMock } from "@tests/mocks/repositories/todo.repository.mock.js";
import { LabelFactory, TodoFactory } from "todo-entity-default";

describe("GetAllTodoInteractor", () => {
   const validation: jest.Mocked<IGetAllTodoValidation> = {
      validate: jest.fn(),
      isValid: jest.fn(),
      getErrors: jest.fn(),
   };

   const repository = new TodoRepositoryMock(
      new TodoFactory(),
      new LabelFactory(),
   );

   const presenter: jest.Mocked<IGetAllTodoPresenter> = {
      present: jest.fn(),
   };

   const getAllTodo = new GetAllTodoInteractor(
      validation,
      repository,
      presenter,
   );

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      validation.isValid = jest.fn<() => boolean>().mockReturnValue(true);
   });

   it("should be define", () => {
      expect(GetAllTodoInteractor).toBeDefined();
      expect(getAllTodo).toBeDefined();
      expect(getAllTodo.execute).toBeDefined();
   });

   it("should call present of presenter to return all Todo", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await getAllTodo.execute({ timestamp: "randomtime", input: {} });

      expect(verifyPresenter).toHaveBeenCalledWith({
         success: true,
         error: null,
         result: expect.any(Array),
      });
   });

   it("should retrieved todo with selected labels", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await getAllTodo.execute({
         timestamp: "randomtime",
         input: {
            filters: { labelIds: ["1"] },
         },
      });

      // Vérifie que le résultat ne contient aucun todo avec un label ayant l'id "1"
      expect(verifyPresenter).toHaveBeenCalledWith(
         expect.objectContaining({
            success: true,
            error: null,
            result: expect.arrayContaining([
               expect.objectContaining({
                  labels: expect.arrayContaining([
                     expect.objectContaining({ id: "1" }),
                  ]),
               }),
            ]),
         }),
      );

      // Ensure no todo with labels not containing id "1"
      if (verifyPresenter?.mock?.calls?.length > 0) {
         const call = verifyPresenter.mock.calls[0];
         if (call !== undefined && call.length > 0 && call[0].result) {
            const presentedResult = call[0].result;
            for (const todo of presentedResult) {
               const labels = todo.labels || [];
               const hasLabelId1 = labels.some((label) => label.id === "1");
               expect(hasLabelId1).toBe(true);
            }
         } else {
            expect(false).toBe(true); // Force fail if presenter was not called
         }
      } else {
         expect(false).toBe(true); // Force fail if presenter was not called
      }
   });
});
