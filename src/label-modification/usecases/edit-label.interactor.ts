import type {
   EditLabelInput,
   IEditLabelInteractor,
   IEditLabelPresenter,
   IEditLabelValidation,
   IGetLabelByIdRepository,
   inputDto,
   ISaveLabelRepository,
} from "todo-usecase";

export class EditLabelInteractor implements IEditLabelInteractor {
   constructor(
      private readonly validation: IEditLabelValidation,
      private readonly getLabelRepository: IGetLabelByIdRepository,
      private readonly saveLabelRepository: ISaveLabelRepository,
      private readonly presenter: IEditLabelPresenter,
   ) {}

   async execute(input: inputDto<EditLabelInput>): Promise<void> {
      try {
         this.validation.validate(input);

         if (!this.validation.isValid()) {
            this.presenter.present({
               success: false,
               error: this.validation.getErrors().map((error) => {
                  return {
                     type: "ValidationError",
                     message: error.toString(),
                  };
               }),
            });
            return;
         }

         const label = await this.getLabelRepository.getLabelById(
            input.input.labelId,
         );

         if (!label) {
            this.presenter.present({
               success: false,
               error: [
                  {
                     type: "NotFound",
                     message: `Label with id ${input.input.labelId} not found`,
                  },
               ],
            });
            return;
         }

         if (input.input.newData.name) {
            label.setName(input.input.newData.name);
         }

         if (input.input.newData.color) {
            label.setColor(input.input.newData.color);
         }

         const newLabel = await this.saveLabelRepository.saveLabel(label);

         this.presenter.present({
            success: true,
            error: null,
            result: {
               labelId: newLabel.getId(),
               name: newLabel.getName(),
               color: newLabel.getColor() ? newLabel.getColor() : null,
            },
         });

         return;
      } catch (error: unknown) {
         if (error instanceof Error)
            this.presenter.present({
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
