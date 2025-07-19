import type { GetAllTodoInput, inputDto } from "todo-usecase";
import { GetAllTodoValidation } from "@todo-retrieval/validations/get-all-todo.validation.js";

describe("GetAllTodoValidation", () => {
   let validator: GetAllTodoValidation;

   beforeEach(() => {
      validator = new GetAllTodoValidation();
   });

   it("should not get an error for valid input", () => {
      const input: inputDto<GetAllTodoInput> = {
         timestamp: new Date(),
         input: {
            filters: {
               done: true,
               dueDate: [new Date("2023-01-01"), new Date("2023-12-31")],
            },
         },
      };
      validator.validate(input);
      expect(validator.getErrors()).toEqual([]);
      expect(validator.isValid()).toBeTruthy();
   });

   it("should get an error for invalid filter keys", () => {
      const input: inputDto<GetAllTodoInput> = {
         timestamp: new Date(),
         input: {
            filters: {
               done: true,
               invalidKey: "someValue",
            } as object,
         },
      };
      validator.validate(input);
      expect(validator.getErrors()[0]).toEqual({
         field: "filters.invalidKey",
         customMessage: "Unexpected filter key: invalidKey",
         rule: "invalid_key",
      });
      expect(validator.isValid()).toBeFalsy();
   });

   it("should not throw an error for empty filters", () => {
      const input: inputDto<GetAllTodoInput> = {
         timestamp: new Date(),
         input: {
            filters: {},
         },
      };
      expect(() => validator.validate(input)).not.toThrow();
   });

   it("should not throw an error when filters is undefined", () => {
      const input: inputDto<GetAllTodoInput> = {
         timestamp: new Date(),
         input: {},
      };
      expect(() => validator.validate(input)).not.toThrow();
   });
});
