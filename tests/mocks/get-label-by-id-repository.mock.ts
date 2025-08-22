import type { ILabel } from "todo-entity";
import type { IGetLabelByIdRepository } from "todo-usecase";

export class GetLabelByIdRepositoryMock implements IGetLabelByIdRepository {
   async getLabelById(labelId: string): Promise<ILabel | null> {
      if (labelId) {
         // Mock implementation returning a sample label
         return {
            getId: () => labelId,
            getName: () => "Sample Label",
            getColor: () => "#FF5733",
            setName: (name: string) => name,
            setColor: (color: string) => color,
         };
      }
      return null;
   }
}
