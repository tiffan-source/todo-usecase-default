import {
   ValidationError,
   type GetTodoByIdInput,
   type IGetTodoByIdValidation,
   type inputDto,
} from "todo-usecase";
import { Validation } from "../../common/validation.js";

export class GetTodoByIdValidation
   extends Validation
   implements IGetTodoByIdValidation
{
   validate(input: inputDto<GetTodoByIdInput>): void {
      if (!input.input.idTodo) {
         this.validationErrors.push(
            new ValidationError("required", "idTodo", "Todo is require"),
         );
      }
   }
}
