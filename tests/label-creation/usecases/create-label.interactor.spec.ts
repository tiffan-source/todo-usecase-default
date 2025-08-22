import {
   ValidationError,
   type CreateLabelInput,
   type ICheckLabelExistRepository,
   type ICreateLabelPresenter,
   type ICreateLabelRepository,
   type ICreateLabelValidation,
   type inputDto,
} from "todo-usecase";
import { CreateLabelInteractor } from "@label-creation/usecases/create-label.interactor.js";
import type { ILabelFactory } from "todo-entity";
import { jest } from "@jest/globals";
import { inputLabelMock } from "@tests/label-creation/mocks/label.mock.js";
import { CreateLabelRepositoryMock } from "@tests/mocks/create-label-repository.mock.js";
import { CheckLabelExistRepositoryMock } from "@tests/mocks/check-label-exist-repository.mock.js";

describe("CreateLabelInteractor", () => {
   const createLabelRepository: ICreateLabelRepository =
      new CreateLabelRepositoryMock();

   const checkLabelRepository: ICheckLabelExistRepository =
      new CheckLabelExistRepositoryMock();

   const presenter: jest.Mocked<ICreateLabelPresenter> = {
      present: jest.fn(),
   };

   const validator: jest.Mocked<ICreateLabelValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   const labelFactory: jest.Mocked<ILabelFactory> = {
      create: jest.fn(),
      createWithId: jest.fn(),
   };

   const createLabelInteractor = new CreateLabelInteractor(
      validator,
      createLabelRepository,
      checkLabelRepository,
      presenter,
      labelFactory,
   );

   const inputLabel: inputDto<CreateLabelInput> = {
      timestamp: "randometime",
      input: {
         name: "Important",
         color: "red",
      },
   };

   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      validator.isValid = jest.fn<() => boolean>().mockReturnValue(true);
      labelFactory.create = jest.fn().mockReturnValue(inputLabelMock);
      checkLabelRepository.checkLabelExists = jest.fn(() =>
         Promise.resolve(false),
      );
   });

   it("should be defined", () => {
      expect(CreateLabelInteractor).toBeDefined();
      expect(createLabelInteractor).toBeDefined();
      expect(createLabelInteractor.execute).toBeDefined();
   });

   it("should call validate to validate label inputDTO", async () => {
      const verifyValidate = jest.spyOn(validator, "validate");
      const verifyIsValid = jest.spyOn(validator, "isValid");

      await createLabelInteractor.execute(inputLabel);

      expect(verifyValidate).toHaveBeenNthCalledWith(1, inputLabel);
      expect(verifyIsValid).toHaveBeenCalledTimes(1);
   });

   it("should call checkLabelRepository to check if label already exists", async () => {
      const verifyCheckLabel = jest.spyOn(
         checkLabelRepository,
         "checkLabelExists",
      );

      await createLabelInteractor.execute(inputLabel);

      expect(verifyCheckLabel).toHaveBeenNthCalledWith(
         1,
         inputLabel.input.name,
      );
   });

   it("should call createLabelRepository to save label in db", async () => {
      const verifyCreateLabel = jest.spyOn(
         createLabelRepository,
         "createLabel",
      );

      await createLabelInteractor.execute(inputLabel);

      expect(verifyCreateLabel).toHaveBeenNthCalledWith(1, inputLabelMock);
   });

   it("should call presenter to present the created label", async () => {
      const verifyPresent = jest.spyOn(presenter, "present");

      await createLabelInteractor.execute(inputLabel);
      expect(verifyPresent).toHaveBeenNthCalledWith(1, {
         result: {
            labelId: inputLabelMock.getId(),
            name: inputLabelMock.getName(),
            color: inputLabelMock.getColor(),
         },
         success: true,
         error: null,
      });
   });

   it("should call present with error if validator return error", async () => {
      const verifyPresent = jest.spyOn(presenter, "present");

      validator.isValid.mockReturnValue(false);
      const validationError = new ValidationError("Validation failed", "name");
      validator.getErrors.mockReturnValue([validationError]);

      await createLabelInteractor.execute(inputLabel);

      expect(verifyPresent).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "ValidationError",
               message: validationError.toString(),
            },
         ],
      });
   });

   it("it should call present with error if execute of create label repository return error", async () => {
      const verifyPresent = jest.spyOn(presenter, "present");
      const repoError = new Error("Repository error");
      // createLabelRepository.createLabel.mockRejectedValue(repoError);
      jest
         .spyOn(createLabelRepository, "createLabel")
         .mockRejectedValue(repoError);

      await createLabelInteractor.execute(inputLabel);

      expect(verifyPresent).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "Unexpected",
               message: repoError.message,
            },
         ],
      });
   });

   it("it should call present with error if execute of check label repository return error", async () => {
      const verifyPresent = jest.spyOn(presenter, "present");
      const repoError = new Error("Repository error");
      // checkLabelRepository.checkLabelExists.mockRejectedValue(repoError);
      jest
         .spyOn(checkLabelRepository, "checkLabelExists")
         .mockRejectedValue(repoError);

      await createLabelInteractor.execute(inputLabel);

      expect(verifyPresent).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "Unexpected",
               message: repoError.message,
            },
         ],
      });
   });

   it("it should call present with error if execute of check label repository return true", async () => {
      const verifyPresent = jest.spyOn(presenter, "present");
      // checkLabelRepository.checkLabelExists.mockResolvedValue(true);
      jest
         .spyOn(checkLabelRepository, "checkLabelExists")
         .mockResolvedValue(true);

      await createLabelInteractor.execute(inputLabel);

      expect(verifyPresent).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "Unexpected",
               message: `Label with name "${inputLabel.input.name}" already exists.`,
            },
         ],
      });
   });

   it("it should return undefined", async () => {
      const result = await createLabelInteractor.execute(inputLabel);
      expect(result).toBeUndefined();
   });
});
