import type { ILabel } from "todo-entity";
import type { ICreateLabelRepository } from "todo-usecase";

export class CreateLabelRepositoryMock implements ICreateLabelRepository {
   async createLabel(label: ILabel): Promise<ILabel> {
      return label;
   }
}
