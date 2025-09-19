// Define types
interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  errorCode?: string;
  correlationId?: string;
  subErrors?: string[];
}


export type { User, AuthState, LoginCredentials, RegisterCredentials, ApiErrorResponse };