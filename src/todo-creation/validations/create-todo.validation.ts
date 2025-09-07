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
      const data = input.input
      // validate title
      if (!data.title || data.title.trim() === "") {
         this.validationErrors.push(
            new ValidationError("required", "title", "Title is required"),
         );
      }

      // validate description
      if (data.description){
         const datatrim = data.description.trim();
         if (datatrim === ""){
            this.validationErrors.push(
               new ValidationError("invalid", "description", "Description cannot be empty if provided")
            )
         } 
         else if (datatrim.length > 500){
            this.validationErrors.push(
               new ValidationError("invalid", "description", "Description cannot be over 500 characters")
            )
         }
      }
      // validate date
      if (data.dueDate){
         const date = new Date(data.dueDate);
         if (isNaN(date.getTime())){
            this.validationErrors.push(
               new ValidationError("invalid", "dueDate", "Due date must be a valid date."),
            );
         }
         else if (date < new Date()){
            this.validationErrors.push(
               new ValidationError("invalid", "dueDate", "Due date must be in the future."),
            );
         }
      }

      // validate labelIds
      if (data.labelIds){
         if (!Array.isArray(data.labelIds)){
            this.validationErrors.push(
               new ValidationError("invalid", "labelIds", "labelIds must be an array."),
            );
         }
         else {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            for (const id of data.labelIds){
               if (typeof id !== "string" || id.trim() === ""){
                  this.validationErrors.push(
                     new ValidationError("invalid", `labelIds`, "Each label ID must be a non-empty string."),
                  );
               }
               else if (!uuidRegex.test(id.trim())){
                  this.validationErrors.push(
                     new ValidationError("invalid", `labelIds`, "Each label ID must be a valid UUID string."),
                  );
               }
            }

         }
      }

      // validate newLabelTitles
      if (data.newLabelTitles){
         if (!Array.isArray(data.newLabelTitles)){
            this.validationErrors.push(
               new ValidationError("invalid", "newLabelTitles", "newLabelTitles must be an array."),
            );
         }
         else {
            for (const title of data.newLabelTitles){
               if (typeof title !== "string"){
                  this.validationErrors.push(
                     new ValidationError("invalid", `newLabelTitles`, "Each new label title must be a string."),
                  );
               }
               else {
                  const trimmed = title.trim();
                  if (trimmed === ""){
                     this.validationErrors.push(
                        new ValidationError("empty", `newLabelTitles`, "New label title cannot be empty."),
                     );
                  } else if (trimmed.length > 50) {
                     this.validationErrors.push(
                        new ValidationError("too long", `newLabelTitles`, "New label title must be 50 characters or less."),
                     );   
                  }
               }
            }
         }
      }
   }      
}
