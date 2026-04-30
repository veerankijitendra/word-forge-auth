class CustomResponse {
  success<T>(data: T, message: string = "Success") {
    return {
      status: "success",
      message,
      data,
    };
  }

  error(message: string = "Error", details?: unknown, stack?: string) {
    const errorResponse: { status: string; message: string; details?: unknown; stack?: string } = {
      status: "error",
      message,
    };
    if (details) {
      errorResponse.details = details;
    }
    if (stack) {
      errorResponse.stack = stack;
    }
    return errorResponse;
  }
}

const response = new CustomResponse();

export { response };
