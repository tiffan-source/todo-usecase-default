import { GetAllLabelInteractor } from "@label-retrieval/usecases/get-all-label.interactor.js";
import { jest } from "@jest/globals";
import type {
   IGetAllLabelInteractor,
   IGetAllLabelRepository,
} from "todo-usecase";
import { LabelRepositoryMock } from "@tests/mocks/repositories/label.repository.mock.js";
import { LabelFactory } from "todo-entity-default";

describe("GetAllLabelInteractor", () => {
   let repository: IGetAllLabelRepository;

   const presenter = {
      present: jest.fn(),
      setCallback: jest.fn(),
   };

   let getAllLabel: IGetAllLabelInteractor;

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      repository = new LabelRepositoryMock(new LabelFactory());
      getAllLabel = new GetAllLabelInteractor(repository, presenter);
   });

   it("should be defined", () => {
      expect(GetAllLabelInteractor).toBeDefined();
      expect(getAllLabel).toBeDefined();
      expect(getAllLabel.execute).toBeDefined();
   });

   it("should call present of presenter to return all Label", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      await getAllLabel.execute({ timestamp: "randomtime", input: undefined });

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: expect.any(Array),
      });
   });
});
