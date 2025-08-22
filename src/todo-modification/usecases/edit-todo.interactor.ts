import type { ILabelFactory } from "todo-entity";
import type {
   EditTodoInput,
   ICheckLabelExistRepository,
   ICreateLabelRepository,
   IEditTodoInteractor,
   IEditTodoPresenter,
   IEditTodoValidation,
   IGetLabelByIdRepository,
   IGetTodoByIdRepository,
   inputDto,
   ISaveTodoRepository,
} from "todo-usecase";

export class EditTodoInteractor implements IEditTodoInteractor {
   constructor(
      private readonly validation: IEditTodoValidation,
      private readonly getTodoRepository: IGetTodoByIdRepository,
      private readonly checkLabelRepository: ICheckLabelExistRepository,
      private readonly createLabelRepository: ICreateLabelRepository,
      private readonly getLabelRepository: IGetLabelByIdRepository,
      private readonly saveTodoRepository: ISaveTodoRepository,
      private readonly presenter: IEditTodoPresenter,
      private readonly labelFactory: ILabelFactory,
   ) {}

   async execute(input: inputDto<EditTodoInput>): Promise<void> {
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
                     type: "NotFoundError",
                     message: `Todo with id ${todoId} not found`,
                  },
               ],
            });
         }

         const { title, description, dueDate, labelIds, newLabelTitles } =
            input.input.newData;

         if (title) todo.modifyTitle(title);
         if (description) todo.describe(description);
         if (dueDate) todo.addDeadline(dueDate);

         // Label gestion
         todo.getLabels().forEach((label) => {
            if (!labelIds?.includes(label.getId())) {
               todo.removeLabel(label);
            }
         });

         for (const label of newLabelTitles || []) {
            const labelExist =
               await this.checkLabelRepository.checkLabelExists(label);

            if (!labelExist) {
               const newLabel = await this.createLabelRepository.createLabel(
                  this.labelFactory.create(label),
               );
               todo.addLabel(newLabel);
            }
         }

         for (const labelId of labelIds || []) {
            if (todo.getLabels().some((l) => l.getId() === labelId)) continue;

            const label = await this.getLabelRepository.getLabelById(labelId);

            if (label) {
               todo.addLabel(label);
            }
         }

         const updatedTodo = await this.saveTodoRepository.saveTodo(todo);

         return this.presenter.present({
            success: true,
            result: {
               todoId: updatedTodo.getId(),
               title: updatedTodo.getTitle(),
               description: updatedTodo.getDescription(),
               doneDate: updatedTodo.getDoneDate(),
               dueDate: updatedTodo.getDueDate(),
               labels: updatedTodo.getLabels()?.map((label) => ({
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
