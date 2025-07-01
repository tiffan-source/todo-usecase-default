import {
   ValidationError,
   type IMarkTodoAsCompletedValidation,
   type inputDto,
   type MarkTodoAsCompletedInput,
} from "todo-usecase";
import { Validation } from "../../common/validation.js";

export class MarkTodoAsCompletedValidation
   extends Validation
   implements IMarkTodoAsCompletedValidation
{
   validate(input: inputDto<MarkTodoAsCompletedInput>): void {
      if (!input.input.todoId) {
         this.validationErrors.push(
            new ValidationError("Todo ID is required", "todoId"),
         );
      }
   }
}
