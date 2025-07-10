import { allLabelsByRepoMock } from "../mocks/label.mock.js";
import { GetAllLabelInteractor } from "@label-retrieval/usecases/get-all-label.interactor.js";
import { jest } from "@jest/globals";
import type { IGetAllLabelRepository } from "todo-usecase";

describe("GetAllLabelInteractor", () => {
   const repository: jest.Mocked<IGetAllLabelRepository> = {
      execute: jest.fn(),
   };

   const presenter = {
      present: jest.fn(),
      setCallback: jest.fn(),
   };

   const getAllLabel = new GetAllLabelInteractor(repository, presenter);

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      repository.execute = jest.fn(() => Promise.resolve(allLabelsByRepoMock));
   });

   it("should be defined", () => {
      expect(GetAllLabelInteractor).toBeDefined();
      expect(getAllLabel).toBeDefined();
      expect(getAllLabel.execute).toBeDefined();
   });

   it("should call execute of repository to get all Label", async () => {
      const verifyRepo = jest.spyOn(repository, "execute");

      await getAllLabel.execute({ timestamp: "randomtime", input: undefined });

      expect(verifyRepo).toHaveBeenCalledTimes(1);
      expect(verifyRepo).toHaveBeenCalledWith();
      expect(verifyRepo).toHaveReturnedWith(
         Promise.resolve(allLabelsByRepoMock),
      );
   });

   it("should call present of presenter to return all Label", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await getAllLabel.execute({ timestamp: "randomtime", input: undefined });

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: allLabelsByRepoMock.map((label) => ({
            id: label.getId(),
            name: label.getName(),
            color: label.getColor() ? label.getColor() : null,
         })),
      });
   });

   it("should call presenter with error if repository fails", async () => {
      const error = new Error("Repository error");
      repository.execute = jest.fn(() => Promise.reject(error));
      const verifyPresenter = jest.spyOn(presenter, "present");

      await getAllLabel.execute({ timestamp: "randomtime", input: undefined });

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "Unexpected",
               message: error.message,
            },
         ],
      });
   });
});
