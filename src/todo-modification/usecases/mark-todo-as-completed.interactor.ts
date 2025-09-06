import type {
   IGetTodoByIdRepository,
   IMarkTodoAsCompletedInteractor,
   IMarkTodoAsCompletedPresenter,
   IMarkTodoAsCompletedValidation,
   inputDto,
   ISaveTodoRepository,
   MarkTodoAsCompletedInput,
} from "todo-usecase";

export class MarkTodoAsCompletedInteractor
   implements IMarkTodoAsCompletedInteractor
{
   constructor(
      private readonly validation: IMarkTodoAsCompletedValidation,
      private readonly getTodoRepository: IGetTodoByIdRepository,
      private readonly saveTodoRepository: ISaveTodoRepository,
      private readonly presenter: IMarkTodoAsCompletedPresenter,
   ) {}

   async execute(input: inputDto<MarkTodoAsCompletedInput>): Promise<void> {
      try {
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

         const todoId = input.input.todoId;
         const todo = await this.getTodoRepository.getTodoById(todoId);

         if (!todo) {
            return this.presenter.present({
               success: false,
               error: [
                  {
                     type: "Unexpected",
                     message: `Todo with id ${todoId} not found`,
                  },
               ],
            });
         }

         todo.accomplish();

         await this.saveTodoRepository.saveTodo(todo);

         return this.presenter.present({
            success: true,
            error: null,
            result: {
               todoId: todo.getId(),
               title: todo.getTitle(),
               description: todo.getDescription(),
               doneDate: todo.getDoneDate(),
               dueDate: todo.getDueDate(),
               labels: todo.getLabels()?.map((label) => ({
                  id: label.getId(),
                  name: label.getName(),
                  color: label.getColor() ? label.getColor() : null,
               })),
            },
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
