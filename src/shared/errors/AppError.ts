export class AppError {
  public readonly error: string;
  public readonly message: string;
  public readonly statusCode: number;
  public readonly details: any[];

  constructor(
    message: string,
    statusCode: number = 400,
    errorCode: string = 'VALIDATION_ERROR',
    details: any[] = []
  ) {
    this.error = errorCode;
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}