import type {
   ICreateTodoRepository,
   IGetAllTodoRepository,
   IGetTodoByIdRepository,
   ISaveTodoRepository,
   SaveTodoRepositoryInput,
} from "todo-usecase";
import type { ILabelFactory, ITodo, ITodoFactory } from "todo-entity";

export class TodoRepositoryMock
   implements
      ICreateTodoRepository,
      ICreateTodoRepository,
      IGetAllTodoRepository,
      IGetTodoByIdRepository,
      ISaveTodoRepository
{
   private todos: Array<{
      id: string;
      title: string;
      description: string;
      doneDate?: Date;
      dueDate?: Date;
      labels: string[];
   }> = [
      {
         id: "1",
         title: "Buy groceries",
         description: "Milk, Bread, Eggs",
         doneDate: undefined,
         dueDate: new Date("2024-06-10T10:00:00Z"),
         labels: [],
      },
      {
         id: "2",
         title: "Read a book",
         description: "Finish reading TypeScript Handbook",
         doneDate: new Date("2024-06-01T10:00:00Z"),
         dueDate: new Date("2024-06-15T10:00:00Z"),
         labels: ["1"],
      },
   ];

   constructor(
      private todoFactory: ITodoFactory,
      private labelFactory: ILabelFactory,
   ) {}

   async createTodo(todo: ITodo): Promise<ITodo> {
      this.todos.push({
         id: todo.getId(),
         title: todo.getTitle(),
         description: todo.getDescription(),
         doneDate: todo.getDoneDate() || undefined,
         dueDate: todo.getDueDate() || undefined,
         labels: todo.getLabels()
            ? todo.getLabels()?.map((label) => label.getId())
            : [],
      });
      return todo;
   }

   async getAllTodos(): Promise<ITodo[]> {
      return this.todos.map((todoData) => {
         const todo: ITodo = this.todoFactory.createWithId(
            todoData.id,
            todoData.title,
         );
         todo.describe(todoData.description);
         if (todoData.doneDate !== undefined)
            todo.accomplish(todoData.doneDate);
         if (todoData.dueDate !== undefined) todo.addDeadline(todoData.dueDate);
         // Implement labels in this mock
         if (todoData?.labels?.length > 0) {
            todoData.labels.forEach((labelId) => {
               const label = this.labelFactory.createWithId(
                  labelId,
                  "Label " + labelId,
               );
               todo.addLabel(label);
            });
         }
         return todo;
      });
   }

   async getTodoById(id: string): Promise<ITodo | null> {
      const todoData = this.todos.find((todo) => todo.id === id);
      if (todoData === undefined) return null;
      const todo: ITodo = this.todoFactory.createWithId(
         todoData.id,
         todoData.title,
      );
      todo.describe(todoData.description);
      if (todoData.doneDate) todo.accomplish(todoData.doneDate);
      if (todoData.dueDate) todo.addDeadline(todoData.dueDate);
      // Labels are not fully implemented in this mock
      return todo;
   }

   async saveTodo(input: SaveTodoRepositoryInput): Promise<ITodo> {
      const index = this.todos.findIndex((todo) => todo.id === input.getId());
      if (index === -1) {
         throw new Error(`Todo with id ${input.getId()} not found`);
      }
      this.todos[index] = {
         id: input.getId(),
         title: input.getTitle(),
         description: input.getDescription(),
         doneDate: input.getDoneDate() || undefined,
         dueDate: input.getDueDate() || undefined,
         labels: input.getLabels()
            ? input.getLabels()?.map((label) => label.getId())
            : [],
      };
      return input;
   }
}
