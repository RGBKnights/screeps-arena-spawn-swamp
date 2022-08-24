class CustomError extends Error {
  constructor(message?: string) {
    super(message)

    // needed for CustomError instanceof Error => true
    Object.setPrototypeOf(this, new.target.prototype);

    // Set the name
    this.name = this.constructor.name

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// create own CustomError sub classes
class SubCustomError extends CustomError { }

export class MethodNotImplementedError extends CustomError {
  constructor() {
    super("Method not implemented.")
  }
}

export class CancellationRequestedError extends CustomError {
  constructor() {
    super("Cancellation Requested.")
  }
}


export class InvaildEnvironmentError extends CustomError {
  constructor() {
    super("Invaild Environment.")
  }
}
