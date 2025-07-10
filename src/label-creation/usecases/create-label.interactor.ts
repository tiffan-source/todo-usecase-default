import type { ILabelFactory } from "todo-entity";
import type {
   CreateLabelInput,
   ICheckLabelExistRepository,
   ICreateLabelInteractor,
   ICreateLabelPresenter,
   ICreateLabelRepository,
   ICreateLabelValidation,
   inputDto,
} from "todo-usecase";

export class CreateLabelInteractor implements ICreateLabelInteractor {
   constructor(
      private readonly createLabelValidator: ICreateLabelValidation,
      private readonly createLabelRepository: ICreateLabelRepository,
      private readonly checkLabelRepository: ICheckLabelExistRepository,
      private readonly createLabelPresenter: ICreateLabelPresenter,
      private readonly labelFactory: ILabelFactory,
   ) {}

   async execute(input: inputDto<CreateLabelInput>): Promise<void> {
      try {
         const { input: labelInput } = input;
         const { name, color } = labelInput;

         this.createLabelValidator.validate(input);

         if (!this.createLabelValidator.isValid()) {
            this.createLabelPresenter.present({
               success: false,
               error: this.createLabelValidator.getErrors().map((error) => ({
                  type: "ValidationError",
                  message: error.toString(),
               })),
            });
            return;
         }

         const labelExists = await this.checkLabelRepository.execute(name);

         if (labelExists) {
            this.createLabelPresenter.present({
               success: false,
               error: [
                  {
                     type: "Unexpected",
                     message: `Label with name "${name}" already exists.`,
                  },
               ],
            });
            return;
         }

         const label = this.labelFactory.create(name);
         if (color) {
            label.setColor(color);
         }

         await this.createLabelRepository.execute(label);

         this.createLabelPresenter.present({
            success: true,
            result: {
               labelId: label.getId(),
               name: label.getName(),
               color: label.getColor(),
            },
            error: null,
         });

         return undefined;
      } catch (error: unknown) {
         if (error instanceof Error) {
            this.createLabelPresenter.present({
               success: false,
               error: [
                  {
                     type: "Unexpected",
                     message: error.message,
                  },
               ],
            });
         }
      }
   }
}
