import type { ValidationError } from "todo-usecase";

export class Validation {
   protected validationErrors: ValidationError[] = [];

   getErrors(): ValidationError[] {
      return this.validationErrors;
   }

   isValid(): boolean {
      return this.validationErrors.length === 0;
   }
}
