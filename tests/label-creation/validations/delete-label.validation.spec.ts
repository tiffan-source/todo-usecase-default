import { DeleteLabelValidation } from "@label-creation/validations/delete-label.validation.js";
import type { DeleteLabelInput, inputDto } from "todo-usecase";

describe("DeleteLabelValidation", () => {
   let validator: DeleteLabelValidation;

   beforeEach(() => {
      validator = new DeleteLabelValidation();
   });

   it("should validate label deletion input", () => {
      const input: inputDto<DeleteLabelInput> = {
         timestamp: "randomTimestamp",
         input: {
            labelId: "labelId",
         },
      };

      validator.validate(input);
      expect(validator.isValid()).toBeTruthy();
      expect(validator.getErrors()).toHaveLength(0);
   });

   it("should require an id", () => {
      const input: inputDto<DeleteLabelInput> = {
         timestamp: "randomTimestamp",
         input: {
            labelId: "",
         },
      };

      validator.validate(input);
      expect(validator.isValid()).toBeFalsy();
      expect(validator.getErrors()).toHaveLength(1);
      expect(validator.getErrors()[0]).toEqual({
         field: "labelId",
         customMessage: "Label ID is required",
         rule: "required",
      });
   });
});
