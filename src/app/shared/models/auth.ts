export interface CheckAuth {
  valid: boolean;
  username: string;
  userId: number;
  role: string;
}

export interface User {
  token: string;
  role?: string;
  username?: string;
  userId?: number;
}
