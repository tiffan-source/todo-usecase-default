import type { CreateLabelInput, inputDto } from "todo-usecase";
import { CreateLabelValidation } from "@label-creation/validations/create-label.validation.js";

describe("CreateLabelValidation", () => {
   let validator: CreateLabelValidation;

   beforeEach(() => {
      validator = new CreateLabelValidation();
   });

   it("should validate label creation input", () => {
      const input: inputDto<CreateLabelInput> = {
         timestamp: "randomTimestamp",
         input: {
            name: "New Label",
         },
      };

      validator.validate(input);
      expect(validator.isValid()).toBeTruthy();
      expect(validator.getErrors()).toHaveLength(0);
   });

   it("should require a name", () => {
      const input: inputDto<CreateLabelInput> = {
         timestamp: "randomTimestamp",
         input: {
            name: "",
         },
      };

      validator.validate(input);
      expect(validator.isValid()).toBeFalsy();
      expect(validator.getErrors()).toHaveLength(1);
      expect(validator.getErrors()[0]).toEqual({
         field: "name",
         customMessage: "Name is required",
         rule: "required",
      });
   });
});
