type WidgetResult = Result<number, Error>;

function validatePositiveInteger(value: string): WidgetResult {
	console.log("validating:", value);

	if (value.length === 0) {
		return errorFailure("No value provided");
	}

	const parsedValue = Number.parseFloat(value);

	if (Number.isNaN(parsedValue)) {
		return errorFailure("Not a valid integer");
	}

	if (Number.isInteger(parsedValue)) {
		return errorFailure("Float value is invalid");
	}

	if (parsedValue <= 0) {
		return errorFailure("Integer must be positive");
	}

	return success(parsedValue);
}

function setStatus(result: WidgetResult) {
	switch (result.outcome) {
		case Outcome.Success: {
			return (document.getElementById("status")!.innerText = "Valid");
		}

		case Outcome.Failure: {
			return (document.getElementById("status")!.innerText = "Invalid");
		}
	}
}

function init() {
	const element = document.getElementById("button");
	element?.addEventListener("click", (event) => {
		event.preventDefault();

		const input = document.getElementById("test") as HTMLInputElement;

		const result = validatePositiveInteger(input.value);

		console.log(`result`, JSON.stringify(result, null, 4));

		if (result.isFailure()) {
			console.log("failure:", result.failure.message);
		}

		if (result.isSuccess()) {
			console.log("success:", result.success);
		}

		setStatus(result);
	});
}

init();
