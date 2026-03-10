export interface ApiError {
  displayMessage?: string;
  message?: string;
  response?: {
    status: number;
    data?: {
      message?: string;
      result?: { errors?: { message?: string } };
    };
  };
}

export type SafeError = Error & ApiError;
