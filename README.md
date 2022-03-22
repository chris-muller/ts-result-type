# ts-result-type

This contains the types and helper methods for a typescript result type that is clear and easy to use.

A lot of the logic is inspired (or copy/pasted) from the following:

- Anthony's article about Either types https://antman-does-software.com/stop-catching-errors-in-typescript-use-the-either-type-to-make-your-code-predictable
- The Swift Result type https://www.swiftbysundell.com/articles/the-power-of-result-types-in-swift/
- The Rust Result type https://doc.rust-lang.org/std/result/
- `fp-ts` Either type  https://gcanti.github.io/fp-ts/modules/Either.ts.html

## Examples
```typescript

function returnsSomeResult(foo?: boolean): Result<string, number> {
	if (foo) {
		// Wraps the value in the success result type
		return success("Success string");
	}

	// Wraps the value in the failure result type
	return failure(404);
}

function someMethod() {
	const result = returnsSomeResult(true);

	// Inside this if statement we know `result.failure` is a number
	// and `result.success` is undefined
	if (result.isFailure()) {
		const test1 = result.failure;

		// `unwrap` returns the failure value and typescript knows `testunwrap` is a number
		const testunwrap = result.unwrap();
	}

	// typescript narrows type inside isSuccess helper
	if (result.isSuccess()) {
		const test2 = result.success;
		const test3 = result.failure;
		const outcome = result.outcome;

		// `unwrap` returns the success value and typescript knows `testunwrap` is a string
		const testunwrap = result.unwrap();
	}

	// returns the success or failure value and typescript only
	// knows that testunwrap is either a number or string
	const testunwrap = result.unwrap();
}
```

## Reasoning

- This uses `Result` over `Either` as this type is likely to be used only for the result of an operation 99% of the time. `Either` types also don't implicitly imply a success/fail state, just a value that can be one of two types of outcome.
- Using the `success` and `failure` terms over `left` and `right` as this type implicitly communicates a success or failure state unlike `Either` as well as the 'convention' of using `Left` for failures seemed too non-obvious when looking through code examples (every article on the topic had to go out of its way to explain the convention), and it made the helper methods clearer when reading through the code.
- Helpers like `isSuccess` or `unwrap` are available on the result value itself, allowing the result to be inspected wherever it's passed without needing to import the helper methods. Helper methods are available separately, however I'm not sure they're worth exporting outside of the module.
- Unlike languages like Swift or Rust we can't pattern match against the type of the result itself, so the `outcome` property has been added as a convenience when using switch statements or other purposes.
