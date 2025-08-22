import { allLabelsByRepoMock } from "@tests/label-retrieval/mocks/label.mock.js";
import type { ILabel } from "todo-entity";
import type { IGetAllLabelRepository } from "todo-usecase";

export class GetAllLabelRepositoryMock implements IGetAllLabelRepository {
   async getAllLabels(): Promise<ILabel[]> {
      return allLabelsByRepoMock;
   }
}
