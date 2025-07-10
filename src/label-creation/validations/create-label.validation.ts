import {
   ValidationError,
   type CreateLabelInput,
   type ICreateLabelValidation,
   type inputDto,
} from "todo-usecase";
import { Validation } from "../../common/validation.js";

export class CreateLabelValidation
   extends Validation
   implements ICreateLabelValidation
{
   validate(input: inputDto<CreateLabelInput>): void {
      if (!input.input.name || input.input.name.trim() === "") {
         this.validationErrors.push(
            new ValidationError("required", "name", "Name is required"),
         );
      }
   }
}
