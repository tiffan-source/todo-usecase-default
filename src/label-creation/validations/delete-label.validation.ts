import {
   ValidationError,
   type DeleteLabelInput,
   type IDeleteLabelValidation,
   type inputDto,
} from "todo-usecase";
import { Validation } from "../../common/validation.js";

export class DeleteLabelValidation
   extends Validation
   implements IDeleteLabelValidation
{
   validate(input: inputDto<DeleteLabelInput>): void {
      if (!input.input.labelId || input.input.labelId.trim() === "") {
         this.validationErrors.push(
            new ValidationError("required", "labelId", "Label ID is required"),
         );
      }
   }
}
