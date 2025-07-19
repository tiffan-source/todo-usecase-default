import {
   ValidationError,
   type GetAllTodoInput,
   type IGetAllTodoValidation,
   type inputDto,
} from "todo-usecase";
import { Validation } from "../../common/validation.js";

export class GetAllTodoValidation
   extends Validation
   implements IGetAllTodoValidation
{
   validate(input: inputDto<GetAllTodoInput>): void {
      const { filters } = input.input;
      if (filters) {
         const allowedKeys = ["done", "dueDate"];
         Object.keys(filters).forEach((key) => {
            if (!allowedKeys.includes(key)) {
               this.validationErrors.push(
                  new ValidationError(
                     "invalid_key",
                     `filters.${key}`,
                     `Unexpected filter key: ${key}`,
                  ),
               );
            }
         });
      }
   }
}
