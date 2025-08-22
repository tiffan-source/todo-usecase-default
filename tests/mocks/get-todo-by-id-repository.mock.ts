import type { ITodo } from "todo-entity";
import type { IGetTodoByIdRepository } from "todo-usecase";

export class GetTodoByIdRepositoryMock implements IGetTodoByIdRepository {
   async getTodoById(todoId: string): Promise<ITodo | null> {
      if (todoId) {
         // nothing
      }
      return null;
   }
}
