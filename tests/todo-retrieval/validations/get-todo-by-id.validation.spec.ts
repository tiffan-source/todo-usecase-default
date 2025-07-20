import { GetTodoByIdValidation } from "@todo-retrieval/validations/get-todo-by-id.validation.js";
import type { inputDto, GetTodoByIdInput } from "todo-usecase";

describe("GetTodoByIdValidation", () => {
   let validator: GetTodoByIdValidation;

   const valideInput: inputDto<GetTodoByIdInput> = {
      timestamp: new Date(),
      input: {
         idTodo: "valid-todo-id",
      },
   };

   const unvalideInputEmpty: inputDto<GetTodoByIdInput> = {
      timestamp: new Date(),
      input: {
         idTodo: "",
      },
   };

   beforeEach(() => {
      validator = new GetTodoByIdValidation();
   });

   it("should be defined", () => {
      expect(GetTodoByIdValidation).toBeDefined();
      expect(validator).toBeDefined();
   });

   it("should not get Error if todo have valid id", () => {
      validator.validate(valideInput);

      expect(validator.isValid()).toBeTruthy();
      expect(validator.getErrors()).toEqual([]);
   });

   it("should get Error if todo have empty id", () => {
      validator.validate(unvalideInputEmpty);

      expect(validator.isValid()).toBeFalsy();
      expect(validator.getErrors()).toEqual([
         {
            field: "idTodo",
            customMessage: "Todo is require",
            rule: "required",
         },
      ]);
   });
});
