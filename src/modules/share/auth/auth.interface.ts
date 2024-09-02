export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface TokenPayload {
  user: UserPayload;
  iat: number;
  exp: number;
}
