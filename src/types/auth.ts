// src/types/auth.ts
export interface RegisterInput {
    email: string;
    password: string;
    fullName: string;
    dateOfBirth: string;
    bioId: string;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface AuthError {
    code: string;
    message: string;
  }