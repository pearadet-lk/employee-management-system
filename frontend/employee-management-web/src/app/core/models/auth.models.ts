import { UserRole } from '../constants/roles';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: UserProfile;
}
