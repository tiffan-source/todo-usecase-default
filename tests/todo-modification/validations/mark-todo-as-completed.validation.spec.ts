import { MarkTodoAsCompletedValidation } from "@todo-modification/validations/mark-todo-as-completed.validation.js";
import type { inputDto, MarkTodoAsCompletedInput } from "todo-usecase";

describe("MarkTodoAsCompletedValidation", () => {
   let validator: MarkTodoAsCompletedValidation;

   const valideInput: inputDto<MarkTodoAsCompletedInput> = {
      timestamp: new Date(),
      input: {
         todoId: "valid-todo-id",
      },
   };

   const unvalideInput: inputDto<MarkTodoAsCompletedInput> = {
      timestamp: new Date(),
      input: {
         todoId: "",
      },
   };

   beforeEach(() => {
      validator = new MarkTodoAsCompletedValidation();
   });

   it("should be defined", () => {
      expect(MarkTodoAsCompletedValidation).toBeDefined();
      expect(validator).toBeDefined();
   });

   it("should not get Error if todo have valid id", () => {
      validator.validate(valideInput);

      expect(validator.isValid()).toBeTruthy();
      expect(validator.getErrors()).toEqual([]);
   });

   it("should get Error if todo have invalid id", () => {
      validator.validate(unvalideInput);

      expect(validator.isValid()).toBeFalsy();
      expect(validator.getErrors()).toEqual([
         {
            field: "todoId",
            customMessage: "Todo ID is required",
            rule: "required",
         },
      ]);
   });
});

it("should be ok", () => {
   expect(1).toBe(1);
});
