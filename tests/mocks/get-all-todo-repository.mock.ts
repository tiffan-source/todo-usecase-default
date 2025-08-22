import type { ITodo } from "todo-entity";
import type { IGetAllTodoRepository } from "todo-usecase";

export class GetAllTodoRepositoryMock implements IGetAllTodoRepository {
   async getAllTodos(): Promise<ITodo[]> {
      // Mock implementation
      return [];
   }
}
