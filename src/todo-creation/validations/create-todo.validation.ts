import {
   type ICreateTodoValidation,
   type CreateTodoInput,
   type inputDto,
   ValidationError,
} from "todo-usecase";
import { Validation } from "../../common/validation.js";

export class CreateTodoValidation
   extends Validation
   implements ICreateTodoValidation
{
   validate(input: inputDto<CreateTodoInput>): void {
      if (!input.input.title) {
         this.validationErrors.push(
            new ValidationError("Title is required", "title"),
         );
      }
   }
}
