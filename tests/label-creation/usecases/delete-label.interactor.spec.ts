import {
   type DeleteLabelInput,
   type IDeleteLabelPresenter,
   type IDeleteLabelRepository,
   type IDeleteLabelValidation,
   type inputDto,
} from "todo-usecase";
import { DeleteLabelInteractor } from "@label-creation/usecases/delete-label.interactor.js";
import { jest } from "@jest/globals";
import { LabelRepositoryMock } from "@tests/mocks/repositories/label.repository.mock.js";
import { LabelFactory } from "todo-entity-default";

describe("DeleteLabelInteractor", () => {
   const deleteLabelRepository: IDeleteLabelRepository =
      new LabelRepositoryMock(new LabelFactory());

   const deleteLabelPresenter: jest.Mocked<IDeleteLabelPresenter> = {
      present: jest.fn(),
   };

   const deleteLabelValidator: jest.Mocked<IDeleteLabelValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   const deleteLabelInteractor = new DeleteLabelInteractor(
      deleteLabelValidator,
      deleteLabelRepository,
      deleteLabelPresenter,
   );

   const badLabelId: inputDto<DeleteLabelInput> = {
      timestamp: "randometime",
      input: {
         labelId: "label123",
      },
   };

   const trueLabelId: inputDto<DeleteLabelInput> = {
      timestamp: "randometime",
      input: {
         labelId: "1",
      },
   };

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      deleteLabelValidator.isValid = jest.fn(() => true);
   });

   it("should be defined", () => {
      expect(DeleteLabelInteractor).toBeDefined();
      expect(deleteLabelInteractor).toBeDefined();
      expect(deleteLabelInteractor.execute).toBeDefined();
   });

   it("should call present method of deleteLabelPresenter if label successfully deleted", async () => {
      const verifyPresenter = jest.spyOn(deleteLabelPresenter, "present");

      await deleteLabelInteractor.execute(trueLabelId);

      expect(verifyPresenter).toHaveBeenCalledWith({
         success: true,
         result: {
            success: true,
         },
         error: null,
      });
   });

   it("should call presenter with errors if repository return false", async () => {
      const verifyPresenter = jest.spyOn(deleteLabelPresenter, "present");
      jest.spyOn(deleteLabelRepository, "deleteLabel").mockResolvedValue(false);

      await deleteLabelInteractor.execute(badLabelId);

      expect(verifyPresenter).toHaveBeenCalledWith({
         success: false,
         error: [
            {
               type: "Unexpected",
               message: `Label with id ${badLabelId.input.labelId} deletion failed`,
            },
         ],
      });
   });

   it("should return undefined", async () => {
      const result = await deleteLabelInteractor.execute(trueLabelId);
      expect(result).toBeUndefined();
   });
});
