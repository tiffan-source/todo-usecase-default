import {
   ValidationError,
   type IMarkTodoAsUncompletedValidation,
   type inputDto,
   type MarkTodoAsUncompletedInput,
} from "todo-usecase";
import { Validation } from "../../common/validation.js";

export class MarkTodoAsUncompletedValidation
   extends Validation
   implements IMarkTodoAsUncompletedValidation
{
   validate(input: inputDto<MarkTodoAsUncompletedInput>): void {
      if (!input.input.todoId) {
         this.validationErrors.push(
            new ValidationError("required", "todoId", "Todo ID is required"),
         );
      }
   }
}
