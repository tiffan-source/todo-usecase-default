import { Validation } from "../../common/validation.js";
import type {
   EditLabelInput,
   IEditLabelValidation,
   inputDto,
} from "todo-usecase";
import { ValidationError } from "todo-usecase";

export class EditLabelValidation
   extends Validation
   implements IEditLabelValidation
{
   validate(input: inputDto<EditLabelInput>): void {
      if (!input.input.labelId || input.input.labelId.trim() === "") {
         this.validationErrors.push(
            new ValidationError(
               "Required",
               "labelId",
               "Label ID is required and cannot be empty.",
            ),
         );
      }

      const newData = input.input.newData;

      if (newData.name !== undefined) {
         if (newData.name.trim() === "") {
            this.validationErrors.push(
               new ValidationError(
                  "Invalid",
                  "newData.name",
                  "Label name cannot be empty.",
               ),
            );
         }
      }

      if (newData.color !== undefined && newData.color !== null) {
         const colorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
         if (!colorRegex.test(newData.color)) {
            this.validationErrors.push(
               new ValidationError(
                  "Invalid",
                  "newData.color",
                  "Color must be a valid hex color code (e.g., #FFFFFF).",
               ),
            );
         }
      }
   }
}
