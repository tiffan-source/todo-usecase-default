import SayHello from "../src/main";

describe("Say Hello", () => {
   it("should return true when sayHello is called", () => {
      const sayHelloInstance = new SayHello();
      const result = sayHelloInstance.sayHello();
      expect(result).toBe(true);
   });
});
