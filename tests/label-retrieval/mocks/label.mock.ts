import type { ILabel } from "todo-entity";

export const allLabelsByRepoMock: Array<ILabel> = [
   {
      getId: () => "label-1",
      getName: () => "Label One",
      getColor: () => "#FF5733",
      setColor: (color: string) => {
         // Mock implementation for setting color
         return color;
      },
      setName: (name: string) => {
         // Mock implementation for setting name
         return name;
      },
   },
   {
      getId: () => "label-2",
      getName: () => "Label Two",
      getColor: () => "#33FF57",
      setColor: (color: string) => {
         // Mock implementation for setting color
         return color;
      },
      setName: (name: string) => {
         // Mock implementation for setting name
         return name;
      },
   },
   {
      getId: () => "label-3",
      getName: () => "Label Three",
      getColor: () => "#3357FF",
      setColor: (color: string) => {
         // Mock implementation for setting color
         return color;
      },
      setName: (name: string) => {
         // Mock implementation for setting name
         return name;
      },
   },
];
