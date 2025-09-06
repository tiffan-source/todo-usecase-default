import {
   type CreateLabelInput,
   type ICreateLabelInteractor,
   type ICreateLabelPresenter,
   type ICreateLabelValidation,
   type inputDto,
} from "todo-usecase";
import { CreateLabelInteractor } from "@label-creation/usecases/create-label.interactor.js";
import type { ILabelFactory } from "todo-entity";
import { jest } from "@jest/globals";
import { LabelFactory } from "todo-entity-default";
import { LabelRepositoryMock } from "@tests/mocks/repositories/label.repository.mock.js";

describe("CreateLabelInteractor", () => {
   let labelRepository;

   const presenter: jest.Mocked<ICreateLabelPresenter> = {
      present: jest.fn(),
   };

   const validator: jest.Mocked<ICreateLabelValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn(),
   };

   let labelFactory: ILabelFactory;

   let createLabelInteractor: ICreateLabelInteractor;

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

      labelFactory = new LabelFactory();

      labelRepository = new LabelRepositoryMock(labelFactory);

      createLabelInteractor = new CreateLabelInteractor(
         validator,
         labelRepository,
         labelRepository,
         presenter,
         labelFactory,
      );
   });

   it("should be defined", () => {
      expect(CreateLabelInteractor).toBeDefined();
      expect(createLabelInteractor).toBeDefined();
      expect(createLabelInteractor.execute).toBeDefined();
   });

   it("should call presenter to present the created label", async () => {
      const verifyPresent = jest.spyOn(presenter, "present");

      await createLabelInteractor.execute(inputLabel);

      expect(verifyPresent).toHaveBeenNthCalledWith(1, {
         result: {
            labelId: expect.any(String),
            name: inputLabel.input.name,
            color: inputLabel.input.color,
         },
         success: true,
         error: null,
      });
   });

   it("it should return undefined", async () => {
      const result = await createLabelInteractor.execute(inputLabel);
      expect(result).toBeUndefined();
   });
});
