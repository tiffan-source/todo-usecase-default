import {
   ValidationError,
   type EditTodoInput,
   type IEditTodoValidation,
   type inputDto,
} from "todo-usecase";
import { Validation } from "../../common/validation.js";

export class EditTodoValidation
   extends Validation
   implements IEditTodoValidation
{
   validate(input: inputDto<EditTodoInput>): void {
      if (!input.input.todoId) {
         this.validationErrors.push(
            new ValidationError("required", "todoId", "Todo ID is required"),
         );
      }
   }
}
