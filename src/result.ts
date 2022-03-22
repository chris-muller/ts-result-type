type Result<T, U> = NonNullable<Success<T> | Failure<U>>;

const Outcome = {
	Success: "SUCCESS",
	Failure: "FAILURE",
} as const;

type Outcome = typeof Outcome[keyof typeof Outcome];

interface ResultBase<T, U> {
	success?: T;
	failure?: U;
	outcome: Outcome; // Useful for switch statements, etc
	isFailure(): this is Failure<U>;
	isSuccess(): this is Success<T>;
	unwrap: () => T | U;
}

// ==============================================
// Success
// ==============================================
interface Success<T> extends ResultBase<T, never> {
	success: T;
	failure?: never;
	outcome: "SUCCESS";
}
const success = <U>(value: U): Success<U> => ({
	success: value,
	outcome: "SUCCESS",
	isFailure: () => false,
	isSuccess: () => true,
	unwrap() {
		return unwrapResult(this);
	},
});

// ==============================================
// Failure
// ==============================================
interface Failure<U> extends ResultBase<never, U> {
	success?: never;
	failure: U;
	outcome: "FAILURE";
}
const failure = <U>(value: U): Failure<U> => ({
	failure: value,
	outcome: "FAILURE",
	isFailure: () => true,
	isSuccess: () => false,
	unwrap() {
		return unwrapResult(this);
	},
});
const errorFailure = <U extends string>(value: U): Failure<Error> => {
	return {
		failure: new Error(value),
		outcome: "FAILURE",
		isFailure: () => true,
		isSuccess: () => false,
		unwrap() {
			return unwrapResult(this);
		},
	};
};

// ==============================================
// Helpers
// ==============================================
type UnwrapResult = <T, U>(e: Result<T, U>) => NonNullable<T | U>;

/*
	We're throwing in this function because this can only occur at runtime if something 
	happens that the TypeScript compiler couldn't anticipate. That means the application
	is in an unexpected state and we should terminate immediately.
*/
const unwrapResult: UnwrapResult = <T, U>({
	success,
	failure,
}: Result<T, U>) => {
	if (success !== undefined && failure !== undefined) {
		throw new Error(
			`Received both failure and success values at runtime when opening a Result\nFailure: ${JSON.stringify(
				failure
			)}\nSuccess: ${JSON.stringify(success)}`
		);
	}

	if (failure !== undefined) {
		return failure as NonNullable<U>; // Typescript is getting confused and returning this type as `T | undefined` unless we add the type assertion
	}

	if (success !== undefined) {
		return success as NonNullable<T>;
	}

	throw new Error(
		`Received no failure or success values at runtime when opening Either`
	);
};

function isFailure<T, U>(r: Result<T, U>): r is Failure<U> {
	return r.outcome === "FAILURE";
}

function isSuccess<T, U>(r: Result<T, U>): r is Success<T> {
	return r.outcome === "SUCCESS";
}
