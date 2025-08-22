import type {
   IGetAllLabelInteractor,
   IGetAllLabelPresenter,
   IGetAllLabelRepository,
   inputDto,
} from "todo-usecase";

export class GetAllLabelInteractor implements IGetAllLabelInteractor {
   constructor(
      private readonly repository: IGetAllLabelRepository,
      private readonly presenter: IGetAllLabelPresenter,
   ) {}

   async execute(input: inputDto<void>): Promise<void> {
      try {
         console.log("Executing GetAllLabelInteractor at", input.timestamp);
         const labels = await this.repository.getAllLabels();

         this.presenter.present({
            success: true,
            error: null,
            result: labels.map((label) => ({
               id: label.getId(),
               name: label.getName(),
               color: label.getColor() ? label.getColor() : null,
            })),
         });
      } catch (error: unknown) {
         if (error instanceof Error) {
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
}
