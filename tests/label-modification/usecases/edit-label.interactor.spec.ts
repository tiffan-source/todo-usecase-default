import { EditLabelInteractor } from "@label-modification/usecases/edit-label.interactor.js";
import { EditLabelValidationMock } from "@tests/mocks/validations/edit-label.validation.mock.js";
import type {
   EditLabelInput,
   IEditLabelPresenter,
   inputDto,
} from "todo-usecase";
import { jest } from "@jest/globals";
import { LabelRepositoryMock } from "@tests/mocks/repositories/label.repository.mock.js";
import { LabelFactory } from "todo-entity-default";
describe("EditLabelInteractor", () => {
   let editLabelInteractor: EditLabelInteractor;
   const presenter: IEditLabelPresenter = {
      present: jest.fn(),
   };

   beforeEach(() => {
      const validationMock = new EditLabelValidationMock();
      const labelRepositoryMock = new LabelRepositoryMock(new LabelFactory());

      editLabelInteractor = new EditLabelInteractor(
         validationMock,
         labelRepositoryMock,
         labelRepositoryMock,
         presenter,
      );
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it("should be defined", () => {
      expect(EditLabelInteractor).toBeDefined();
   });

   it("should call presenter with error if input fail validation (id empty)", () => {
      const presenterCall = jest.spyOn(presenter, "present");

      editLabelInteractor.execute({
         timestamp: new Date(),
         input: {
            labelId: "",
            newData: {
               color: "#345672",
               name: "test",
            },
         },
      });

      expect(presenterCall).toHaveBeenCalledWith({
         success: false,
         error: [
            {
               type: "ValidationError",
               message: "labelId can not be empty",
            },
         ],
      });
   });

   it("should call presenter with error if todo not found", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      const badInputLabelTest: inputDto<EditLabelInput> = {
         timestamp: new Date(),
         input: {
            labelId: "non-existent-id",
            newData: {
               color: "#FFFFFF",
               name: "NonExistentLabel",
            },
         },
      };

      await editLabelInteractor.execute(badInputLabelTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: false,
         error: [
            {
               type: "NotFound",
               message: `Label with id ${badInputLabelTest.input.labelId} not found`,
            },
         ],
      });
   });

   it("should call presenter with success if label is edited", async () => {
      const verifyPresenter = jest.spyOn(presenter, "present");

      const goodInputLabelTest: inputDto<EditLabelInput> = {
         timestamp: new Date(),
         input: {
            labelId: "1",
            newData: {
               color: "#123456",
               name: "EditedLabel",
            },
         },
      };

      await editLabelInteractor.execute(goodInputLabelTest);

      expect(verifyPresenter).toHaveBeenNthCalledWith(1, {
         success: true,
         error: null,
         result: {
            labelId: "1",
            name: "EditedLabel",
            color: "#123456",
         },
      });
   });
});
