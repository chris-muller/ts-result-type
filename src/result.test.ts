/*
 * This file contains methods to help show typescript's
 * type narrowing of the type as you traverse the logic
 */

function returnResultTestHelper(arg: boolean): Result<number, string> {
	if (arg) {
		return success(1);
	}

	return failure("failure message");
}

function testHelpers() {
	const result = returnResultTestHelper(true);
	// typescript narrows type inside isFailure helper
	if (result.isFailure()) {
		const test1 = result.failure;
		const testunwrap = result.unwrap();
	}

	// typescript narrows type inside isSuccess helper
	if (result.isSuccess()) {
		const test2 = result.success;
		const test3 = result.failure;
		const outcome = result.outcome;
		const testunwrap = result.unwrap();
	}

	// testunwrap is a number or string
	const testunwrap = result.unwrap();
}

function testSwitchStatementMatching() {
	const result = returnResultTestHelper(true);

	switch (result.outcome) {
		// Compares result outcome with `Outcome` enum
		case Outcome.Success: {
			const test1 = result.success;
			const test2 = result.failure;

			return;
		}

		case Outcome.Failure: {
			const test1 = result.success;
			const test2 = result.failure;

			return;
		}
	}
}

testHelpers();
testSwitchStatementMatching();
