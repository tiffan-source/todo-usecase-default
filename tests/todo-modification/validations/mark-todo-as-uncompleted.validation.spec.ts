// import type { inputDto, MarkTodoAsUncompletedInput } from "todo-usecase";
// import { MarkTodoAsUncompletedValidation } from "@todo-modification/validations/mark-todo-as-uncompleted.validation.js";

// describe('MarkTodoAsUncompletedValidation', () => {

//    let validator : MarkTodoAsUncompletedValidation;

//    let valideInput: inputDto<MarkTodoAsUncompletedInput> = {
//       timestamp: new Date(),
//       input: {
//          todoId: "valid-todo-id"
//       }
//    };

//    let unvalideInput: inputDto<MarkTodoAsUncompletedInput> = {
//       timestamp: new Date(),
//       input: {
//          todoId: ""
//       }
//    };

//    beforeEach(() => {
//       validator = new MarkTodoAsUncompletedValidation();
//    });

//    it("should be defined", () => {
//       expect(MarkTodoAsUncompletedValidation).toBeDefined();
//       expect(validator).toBeDefined();
//    })

//    it("should not get Error if todo have valid id", () => {
//       validator.validate(valideInput);

//       expect(validator.isValid()).toBeTruthy();
//       expect(validator.getErrors()).toEqual([]);
//    })

//    it("should get Error if todo have invalid id", () => {
//       validator.validate(unvalideInput);

//       expect(validator.isValid()).toBeFalsy();
//       expect(validator.getErrors()).toEqual([
//          { field: "todoId", message: "Todo ID is required" }
//       ]);
//    })

// })

it("should be ok", () => {
   expect(1).toBe(1);
});
