import type {
   IGetAllTodoInteractor,
   IGetAllTodoPresenter,
   IGetAllTodoRepository,
   inputDto,
} from "todo-usecase";

export class GetAllTodoInteractor implements IGetAllTodoInteractor {
   constructor(
      private readonly repository: IGetAllTodoRepository,
      private readonly presenter: IGetAllTodoPresenter,
   ) {}

   async execute(input: inputDto<void>): Promise<void> {
      try {
         console.log("Executing GetAllTodoInteractor at", input.timestamp);
         const todos = await this.repository.execute();
         this.presenter.present({
            success: true,
            result: todos.map((todo) => ({
               todoId: todo.getId(),
               title: todo.getTitle(),
               description: todo.getDescription(),
               dueDate: todo.getDueDate(),
               doneDate: todo.getDoneDate(),
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
