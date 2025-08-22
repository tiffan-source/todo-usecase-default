import type { ITodo } from "todo-entity";
import type {
   ICreateTodoRepository,
   CreateTodoRepositoryInput,
} from "todo-usecase";

export class CreateTodoRepositoryMock implements ICreateTodoRepository {
   async createTodo(todo: CreateTodoRepositoryInput): Promise<ITodo> {
      if (todo) {
         // nothing
      }
      return todo as ITodo;
   }
}
