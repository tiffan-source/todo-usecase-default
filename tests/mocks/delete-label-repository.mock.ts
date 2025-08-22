import type { IDeleteLabelRepository } from "todo-usecase";

export class DeleteLabelRepositoryMock implements IDeleteLabelRepository {
   async deleteLabel(labelId: string): Promise<boolean> {
      if (labelId) {
         // nothing
      }
      return true;
   }
}
