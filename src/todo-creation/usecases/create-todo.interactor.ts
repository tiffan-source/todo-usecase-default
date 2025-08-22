import type { ILabel, ILabelFactory, ITodo, ITodoFactory } from "todo-entity";
import type {
   CreateTodoInput,
   ICheckLabelExistRepository,
   ICreateLabelRepository,
   ICreateTodoInteractor,
   ICreateTodoPresenter,
   ICreateTodoRepository,
   ICreateTodoValidation,
   IGetLabelByIdRepository,
   inputDto,
} from "todo-usecase";

export class CreateTodoInteractor implements ICreateTodoInteractor {
   constructor(
      private readonly validation: ICreateTodoValidation,
      private readonly createTodoRepository: ICreateTodoRepository,
      private readonly createLabelRepository: ICreateLabelRepository,
      private readonly checkLabelRepository: ICheckLabelExistRepository,
      private readonly getLabelRepository: IGetLabelByIdRepository,
      private readonly presenter: ICreateTodoPresenter,
      private readonly todoFactory: ITodoFactory,
      private readonly labelFactory: ILabelFactory,
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

         const { title, description, newLabelTitles, labelIds, dueDate } =
            input.input;

         const todo: ITodo = this.todoFactory.create(title);
         todo.describe(description || "");

         // Label gestion

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
            const label = await this.getLabelRepository.getLabelById(labelId);

            if (label) {
               todo.addLabel(label);
            }
         }

         // Due date gestion
         if (dueDate) {
            todo.addDeadline(dueDate);
         }

         const todoResult = await this.createTodoRepository.createTodo(todo);

         return this.presenter.present({
            success: true,
            result: {
               title: todoResult.getTitle(),
               todoId: todoResult.getId(),
               description: todoResult.getDescription(),
               doneDate: todoResult.getDoneDate(),
               dueDate: todoResult.getDueDate(),
               labels: todoResult.getLabels().map((label: ILabel) => ({
                  id: label.getId(),
                  name: label.getName(),
                  color: label.getColor(),
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
