import type { ITodo } from "todo-entity";
import type { ISaveTodoRepository } from "todo-usecase";

export class SaveTodoRepositoryMock implements ISaveTodoRepository {
   async saveTodo(todo: ITodo): Promise<ITodo> {
      return todo;
   }
}
