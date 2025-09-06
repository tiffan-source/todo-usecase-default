import type { ILabel, ILabelFactory } from "todo-entity";
import type {
   ICheckLabelExistRepository,
   ICreateLabelRepository,
   IDeleteLabelRepository,
   IGetAllLabelRepository,
   IGetLabelByIdRepository,
} from "todo-usecase";

export class LabelRepositoryMock
   implements
      ICheckLabelExistRepository,
      ICreateLabelRepository,
      IDeleteLabelRepository,
      IGetAllLabelRepository,
      IGetLabelByIdRepository
{
   private labels: { id: string; name: string; color: string }[] = [
      { id: "1", name: "existing-label", color: "red" },
   ];

   constructor(private labelFactory: ILabelFactory) {}

   async checkLabelExists(name: string): Promise<boolean> {
      return this.labels.some((label) => label.name === name);
   }

   async createLabel(label: ILabel): Promise<ILabel> {
      const newLabel = {
         id: label.getId(),
         name: label.getName(),
         color: label.getColor(),
      };
      this.labels.push(newLabel);
      return label;
   }

   async deleteLabel(id: string): Promise<boolean> {
      const index = this.labels.findIndex((label) => label.id === id);
      if (index !== -1) {
         this.labels.splice(index, 1);
         return true;
      }
      return false;
   }

   async getAllLabels(): Promise<ILabel[]> {
      return this.labels.map((label) => {
         const labelEntity: ILabel = this.labelFactory.createWithId(
            label.id,
            label.name,
         );
         if (label.color) {
            labelEntity.setColor(label.color);
         }
         return labelEntity;
      });
   }

   async getLabelById(id: string): Promise<ILabel | null> {
      const label = this.labels.find((label) => label.id === id);
      let labelEntity: ILabel;
      if (label) {
         labelEntity = this.labelFactory.createWithId(label.id, label.name);
         if (label.color) {
            labelEntity.setColor(label.color);
         }
         return labelEntity;
      } else return null;
   }
}
