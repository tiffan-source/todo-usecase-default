import { EditTodoValidation } from "@todo-modification/validations/edit-todo.validation.js";

describe("EditTodoValidation", () => {
   let validator: EditTodoValidation;

   const validInput = {
      timestamp: new Date(),
      input: {
         todoId: "valid-todo-id",
         newData: {
            title: "valid title",
            description: "valid description",
            dueDate: new Date("2025-01-01"),
            labelIds: ["label1", "label2"],
            newLabelTitles: ["urgent"],
         },
      },
   };

   const invalidInput = {
      timestamp: new Date(),
      input: {
         todoId: "",
         newData: {
            title: "valid title",
            description: "valid description",
            dueDate: new Date("2025-01-01"),
            labelIds: ["label1", "label2"],
            newLabelTitles: ["urgent"],
         },
      },
   };

   beforeEach(() => {
      validator = new EditTodoValidation();
   });

   it("should be defined", () => {
      expect(EditTodoValidation).toBeDefined();
      expect(validator).toBeDefined();
   });

   it("should not get Error if todo have valid id", () => {
      validator.validate(validInput);

      expect(validator.isValid()).toBeTruthy();
      expect(validator.getErrors()).toEqual([]);
   });

   it("should get Error if todo have invalid id", () => {
      validator.validate(invalidInput);

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
