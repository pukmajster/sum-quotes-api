import { Request } from "express";
import { User } from "src/users/user.entity";

export interface TokenPayload {
  user: User;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface LoginPayload {
  email: string
  password: string
}