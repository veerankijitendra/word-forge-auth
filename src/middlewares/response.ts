class CustomResponse {
  success<T>(data: T, message: string = 'Success') {
    return {
      status: 'success',
      message,
      data,
    };
  }

  error(message: string = 'Error', details?: any, stack?: string) {
    return {
      status: 'error',
      message,
      ...(details && { details }),
      ...(stack && { stack }),
    };
  }
}

const response = new CustomResponse();

export { response };
