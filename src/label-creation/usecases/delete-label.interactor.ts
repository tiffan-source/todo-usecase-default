import type {
   DeleteLabelInput,
   IDeleteLabelInteractor,
   IDeleteLabelPresenter,
   IDeleteLabelRepository,
   IDeleteLabelValidation,
   inputDto,
} from "todo-usecase";

export class DeleteLabelInteractor implements IDeleteLabelInteractor {
   constructor(
      private readonly deleteLabelValidator: IDeleteLabelValidation,
      private readonly deleteLabelRepository: IDeleteLabelRepository,
      private readonly deleteLabelPresenter: IDeleteLabelPresenter,
   ) {}

   async execute(labelId: inputDto<DeleteLabelInput>): Promise<void> {
      try {
         this.deleteLabelValidator.validate(labelId);
         if (!this.deleteLabelValidator.isValid()) {
            this.deleteLabelPresenter.present({
               success: false,
               error: this.deleteLabelValidator.getErrors().map((error) => ({
                  type: "ValidationError",
                  message: error.toString(),
               })),
            });
            return;
         }

         const result = await this.deleteLabelRepository.deleteLabel(
            labelId.input.labelId,
         );
         if (result) {
            this.deleteLabelPresenter.present({
               success: true,
               result: {
                  success: true,
               },
               error: null,
            });
         } else {
            this.deleteLabelPresenter.present({
               success: false,
               error: [
                  {
                     type: "Unexpected",
                     message: `Label with id ${labelId.input.labelId} deletion failed`,
                  },
               ],
            });
         }
      } catch (error: unknown) {
         if (error instanceof Error) {
            this.deleteLabelPresenter.present({
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
