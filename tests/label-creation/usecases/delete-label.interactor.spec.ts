import {
   ValidationError,
   type DeleteLabelInput,
   type IDeleteLabelPresenter,
   type IDeleteLabelRepository,
   type IDeleteLabelValidation,
   type inputDto,
} from "todo-usecase";
import { DeleteLabelInteractor } from "@label-creation/usecases/delete-label.interactor.js";
import { jest } from "@jest/globals";

describe("DeleteLabelInteractor", () => {
   const deleteLabelRepository: jest.Mocked<IDeleteLabelRepository> = {
      execute: jest.fn(),
   };

   const deleteLabelPresenter: jest.Mocked<IDeleteLabelPresenter> = {
      present: jest.fn(),
      setCallback: jest.fn(),
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

   const inputLabelId: inputDto<DeleteLabelInput> = {
      timestamp: "randometime",
      input: {
         labelId: "label123",
      },
   };

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      deleteLabelValidator.isValid = jest.fn(() => true);
      deleteLabelRepository.execute = jest.fn(() => Promise.resolve(true));
   });

   it("should be defined", () => {
      expect(DeleteLabelInteractor).toBeDefined();
      expect(deleteLabelInteractor).toBeDefined();
      expect(deleteLabelInteractor.execute).toBeDefined();
   });

   it("should call validate method of deleteLabelValidator to validate input", async () => {
      const verifyValidate = jest.spyOn(deleteLabelValidator, "validate");
      const verifyIsValid = jest.spyOn(deleteLabelValidator, "isValid");

      await deleteLabelInteractor.execute(inputLabelId);
      expect(verifyValidate).toHaveBeenCalledWith(inputLabelId);
      expect(verifyIsValid).toHaveBeenCalledTimes(1);
   });

   it("should call delete label repository execute method", async () => {
      const verifyRepo = jest.spyOn(deleteLabelRepository, "execute");

      await deleteLabelInteractor.execute(inputLabelId);

      expect(verifyRepo).toHaveBeenCalledWith(inputLabelId.input.labelId);
   });

   it("should call present method of deleteLabelPresenter if label successfully deleted", async () => {
      const verifyPresenter = jest.spyOn(deleteLabelPresenter, "present");

      await deleteLabelInteractor.execute(inputLabelId);

      expect(verifyPresenter).toHaveBeenCalledWith({
         success: true,
         result: {
            success: true,
         },
         error: null,
      });
   });

   it("should call presenter with errors if validation fails", async () => {
      const verifyPresenter = jest.spyOn(deleteLabelPresenter, "present");
      const errors = new ValidationError("Validation failed", "name");
      deleteLabelValidator.isValid = jest.fn(() => false);
      deleteLabelValidator.getErrors = jest.fn(() => [errors]);

      await deleteLabelInteractor.execute(inputLabelId);

      expect(verifyPresenter).toHaveBeenCalledWith({
         success: false,
         error: [
            {
               type: "ValidationError",
               message: errors.toString(),
            },
         ],
      });
   });

   it("should call presenter with errors if repository fails", async () => {
      const verifyPresenter = jest.spyOn(deleteLabelPresenter, "present");
      const repoError = new Error("Repository error");
      deleteLabelRepository.execute.mockRejectedValue(repoError);

      await deleteLabelInteractor.execute(inputLabelId);

      expect(verifyPresenter).toHaveBeenCalledWith({
         success: false,
         error: [
            {
               type: "Unexpected",
               message: repoError.message,
            },
         ],
      });
   });

   it("should call presenter with errors if repository return false", async () => {
      const verifyPresenter = jest.spyOn(deleteLabelPresenter, "present");
      deleteLabelRepository.execute.mockResolvedValue(false);

      await deleteLabelInteractor.execute(inputLabelId);

      expect(verifyPresenter).toHaveBeenCalledWith({
         success: false,
         error: [
            {
               type: "Unexpected",
               message: `Label with id ${inputLabelId.input.labelId} deletion failed`,
            },
         ],
      });
   });

   it("should return undefined", async () => {
      const result = await deleteLabelInteractor.execute(inputLabelId);
      expect(result).toBeUndefined();
   });
});
