import type {
   IGetUncompletedTodosPresenter,
   IGetUncompletedTodosRepository,
   IGetUncompletedTodosInteractor,
   inputDto,
} from "todo-usecase";

export class GetUncompletedTodosInteractor
   implements IGetUncompletedTodosInteractor
{
   constructor(
      private readonly repository: IGetUncompletedTodosRepository,
      private readonly presenter: IGetUncompletedTodosPresenter,
   ) {}

   async execute(input: inputDto<void>): Promise<void> {
      try {
         console.log(
            "Executing GetUncompletedTodosInteractor at",
            input.timestamp,
         );
         const todos = await this.repository.execute();
         this.presenter.present({
            success: true,
            result: todos.map((todo) => ({
               todoId: todo.getId(),
               title: todo.getTitle(),
               description: todo.getDescription(),
               dueDate: todo.getDueDate(),
               doneDate: todo.getDoneDate(), //
               labels: todo.getLabels()?.map((label) => ({
                  id: label.getId(),
                  name: label.getName(),
                  color: label.getColor() ? label.getColor() : null,
               })),
            })),
            error: null,
         });
      } catch (error: unknown) {
         if (error instanceof Error)
            return this.presenter.present({
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
