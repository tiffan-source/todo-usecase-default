import type { ITodo, ITodoFactory } from "todo-entity";
import type {
   CreateTodoInput,
   ICreateTodoInteractor,
   ICreateTodoPresenter,
   ICreateTodoRepository,
   ICreateTodoValidation,
   inputDto,
} from "todo-usecase";

export class CreateTodoInteractor implements ICreateTodoInteractor {
   constructor(
      private readonly validation: ICreateTodoValidation,
      private readonly repository: ICreateTodoRepository,
      private readonly presenter: ICreateTodoPresenter,
      private readonly todoFactory: ITodoFactory,
   ) {}

   async execute(input: inputDto<CreateTodoInput>): Promise<void> {
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

         const { title, description } = input.input;

         const todo: ITodo = this.todoFactory.create(title);
         todo.describe(description || "");

         const todoResult = await this.repository.execute(todo);

         return this.presenter.present({
            success: true,
            result: {
               title: todoResult.getTitle(),
               todoId: todoResult.getId(),
               description: todoResult.getDescription(),
               doneDate: todoResult.getDoneDate(),
               dueDate: todoResult.getDueDate(),
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
