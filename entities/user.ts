export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'apple' | 'google';
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  isNewUser: boolean;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
