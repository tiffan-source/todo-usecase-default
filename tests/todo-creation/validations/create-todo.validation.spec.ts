import { CreateTodoValidation } from "@todo-creation/validations/create-todo.validation.js";
import type { CreateTodoInput, inputDto } from "todo-usecase";

describe("CreateTodoValidation", () => {
   let validator: CreateTodoValidation;

   beforeEach(() => {
      validator = new CreateTodoValidation();
   });

   it("should validate todo creation input", () => {
      const input: inputDto<CreateTodoInput> = {
         timestamp: "randomTimestamp",
         input: {
            title: "New Todo",
            description: "Todo description",
         },
      };

      validator.validate(input);

      expect(validator.getErrors()).toEqual([]);
   });

   it("should require a title", () => {
      const input: inputDto<CreateTodoInput> = {
         timestamp: "randomTimestamp",
         input: {
            title: "",
            description: "Todo description",
         },
      };

      validator.validate(input);

      expect(validator.isValid()).toBeFalsy();
      expect(validator.getErrors()).toHaveLength(1);
      expect(validator.getErrors()[0]).toEqual({
         field: "title",
         customMessage: "Title is required",
         rule: "required",
      });
   });
});
