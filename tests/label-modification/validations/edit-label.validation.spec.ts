import { EditLabelValidation } from "@label-modification/validations/edit-label.validation.js";
import type { EditLabelInput, inputDto } from "todo-usecase";

describe("EditLabelValidation", () => {
   it("should be defined", () => {
      expect(EditLabelValidation).toBeDefined();
   });

   it("should create an instance", () => {
      const validator = new EditLabelValidation();
      expect(validator).toBeInstanceOf(EditLabelValidation);
   });

   it("should validate correct input", () => {
      const validator = new EditLabelValidation();
      const input: inputDto<EditLabelInput> = {
         timestamp: "2024-10-10T10:10:10Z",
         input: {
            labelId: "label-123",
            newData: {
               name: "Updated Label Name",
               color: "#FF5733",
            },
         },
      };
      validator.validate(input);

      expect(validator.isValid()).toBe(true);
      expect(validator.getErrors()).toEqual([]);
   });

   it("should invalidate incorrect input", () => {
      const validator = new EditLabelValidation();
      const input: inputDto<EditLabelInput> = {
         timestamp: "2024-10-10T10:10:10Z",
         input: {
            labelId: "", // Invalid: empty labelId
            newData: {
               name: "hj", // Invalid: empty name
               color: "not-a-color", // Invalid: not a valid color code
            },
         },
      };
      validator.validate(input);

      expect(validator.isValid()).toBe(false);
      expect(validator.getErrors().length).toBeGreaterThan(0);
   });

   it("should invalidate name empty name", () => {
      const validator = new EditLabelValidation();
      const input: inputDto<EditLabelInput> = {
         timestamp: "2024-10-10T10:10:10Z",
         input: {
            labelId: "label-123",
            newData: {
               name: "", // Invalid: empty name
               color: "#FF5733",
            },
         },
      };
      validator.validate(input);

      expect(validator.isValid()).toBe(false);
      expect(validator.getErrors().length).toBeGreaterThan(0);
   });

   it("should invalidate invalid color", () => {
      const validator = new EditLabelValidation();
      const input1: inputDto<EditLabelInput> = {
         timestamp: "2024-10-10T10:10:10Z",
         input: {
            labelId: "label-123",
            newData: {
               name: "Valid Name",
               color: "not-a-color", // Invalid: not a valid color code
            },
         },
      };
      const input2: inputDto<EditLabelInput> = {
         timestamp: "2024-10-10T10:10:10Z",
         input: {
            labelId: "label-123",
            newData: {
               name: "Valid Name",
               color: "", // Invalid: not a valid color code
            },
         },
      };
      validator.validate(input1);
      validator.validate(input2);

      expect(validator.isValid()).toBe(false);
      expect(validator.getErrors().length).toBe(2);
   });
});
