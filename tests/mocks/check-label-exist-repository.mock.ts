import type { ICheckLabelExistRepository } from "todo-usecase";

export class CheckLabelExistRepositoryMock
   implements ICheckLabelExistRepository
{
   async checkLabelExists(labelName: string): Promise<boolean> {
      if (labelName === "existing-label") {
         return true;
      }
      return false;
   }
}
