export interface CheckAuth {
  valid: boolean;
  username: string;
  userId: string;
  role: string;
}

export interface User {
  token: string;
  role?: string;
  username?: string;
  userId?: string;
}
