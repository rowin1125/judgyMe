# Unit testing in Jest

## Location

Try to locate the test as close to the subject as possible.

When you have a `helpers.ts` for example and you want to test some functions from those helpers,
place the test in the same folder with a name `helpers.test.ts`.

When the test is a global test and you cannot place it directly next to the subject then you can place it in the `tests/unit` folder.

## Naming conventions

Group tests from one function in a `describe` block. The name of that block should corespondent to the name of the function being tested.
When you test multiple scenario's for that function you can also nest those in a describe block. If you need to do specifics to setup for that scenario you can use the `beforeEach` hook.

Example:

```js
describe("Stack.prototype.push()", () => {
    let stack;
    let result;

    describe("when the stack is not full", () => {
        beforeEach(() => {
            stack = new Stack({ capacity: 5, contents: [1, 2, 3] });
            result = stack.push(4);
        });

        it("returns true", () => {
            expect(result).to.eql(true);
        });

        it("adds the new item to the stack", () => {
            expect(stack.contents).to.eql([1, 2, 3, 4]);
        });
    });

    describe("when the stack is full", () => {
        beforeEach(() => {
            stack = new Stack({ capacity: 3, contents: [1, 2, 3] });
            result = stack.push(4);
        });

        it("returns false", () => {
            expect(result).to.eql(false);
        });

        it("does not add the new item to the stack", () => {
            expect(stack.contents).to.eql([1, 2, 3]);
        });
    });
});
```
