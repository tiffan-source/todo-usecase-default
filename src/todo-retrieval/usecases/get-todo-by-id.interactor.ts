import type {
   GetTodoByIdInput,
   IGetTodoByIdInteractor,
   IGetTodoByIdPresenter,
   IGetTodoByIdRepository,
   IGetTodoByIdValidation,
   inputDto,
} from "todo-usecase";

export class GetTodoByIdInteractor implements IGetTodoByIdInteractor {
   constructor(
      private readonly validation: IGetTodoByIdValidation,
      private readonly repository: IGetTodoByIdRepository,
      private readonly presenter: IGetTodoByIdPresenter,
   ) {}

   async execute(input: inputDto<GetTodoByIdInput>): Promise<void> {
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

         const todo = await this.repository.execute(input.input.idTodo);

         if (!todo) {
            this.presenter.present({
               success: false,
               error: [
                  {
                     type: "NotFound",
                     message: `Todo with id ${input.input.idTodo} not found`,
                  },
               ],
            });
            return;
         }

         this.presenter.present({
            success: true,
            result: {
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
            },
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
