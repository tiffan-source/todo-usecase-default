import type {
   GetAllTodoInput,
   IGetAllTodoInteractor,
   IGetAllTodoPresenter,
   IGetAllTodoRepository,
   IGetAllTodoValidation,
   inputDto,
} from "todo-usecase";

export class GetAllTodoInteractor implements IGetAllTodoInteractor {
   constructor(
      private readonly validation: IGetAllTodoValidation,
      private readonly repository: IGetAllTodoRepository,
      private readonly presenter: IGetAllTodoPresenter,
   ) {}

   async execute(input: inputDto<GetAllTodoInput>): Promise<void> {
      try {
         const { filters } = input.input;
         this.validation.validate(input);
         if (!this.validation.isValid()) {
            return this.presenter.present({
               success: false,
               error: this.validation.getErrors().map((error) => {
                  return {
                     type: "ValidationError",
                     message: error.toString(),
                  };
               }),
            });
         }

         const todos = await this.repository.getAllTodos({
            filters: {
               done: filters?.done,
               dueDate: filters?.dueDate,
            },
         });
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
