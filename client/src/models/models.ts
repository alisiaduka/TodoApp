import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

export interface IUserData {
  user_name: string;
  email: string;
  password: string;
}

export interface IUser {
  user_id: number;
  user_name: string;
  email: string;
}

export interface IAuthResponse {
  message: string;
  token?: string;
  user: IUser;
}

export interface ITodo {
  todo_id: number;
  user_id: number;
  task_name: string;
  description: string;
  priority: string;
  timestamp: string;
}

export interface ITodosResponse {
  todo: ITodo[];
  user_id: number;
}

export interface ITodoPayload {
  task_name: string;
  description: string;
  priority: string;
}

export interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
