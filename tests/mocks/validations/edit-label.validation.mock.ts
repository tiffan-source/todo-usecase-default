import {
   ValidationError,
   type EditLabelInput,
   type IEditLabelValidation,
   type inputDto,
} from "todo-usecase";
import { Validation } from "@common/validation.js";

// Ajuster le chemin d'import de l'interface selon votre projet

export class EditLabelValidationMock
   extends Validation
   implements IEditLabelValidation
{
   // validate doit vérifier l'existence de l'id
   validate(payload: inputDto<EditLabelInput>) {
      if (!payload || !payload.input || !payload.input.labelId) {
         this.validationErrors.push(
            new ValidationError(
               "required",
               "labelId",
               "labelId can not be empty",
            ),
         );
      }
   }
}
