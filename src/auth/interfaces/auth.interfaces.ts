import { Request } from "express";
import { User } from "src/users/user.entity";

export interface TokenPayload {
  userId: number;
}

export interface RequestWithUser extends Request {
  user: User;
}