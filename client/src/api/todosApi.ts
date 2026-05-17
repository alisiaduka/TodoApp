import Axios from "./axios";
import { ITodoPayload, ITodosResponse } from "../models/models";

const TodoApi = {
  getTodoByUserId: async (user_id: number) => {
    try {
      const response = await Axios.get<ITodosResponse>(`/todos/get/user/${user_id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message ?? "API error";
    }
  },

  createTodo: async (user_id: number, payload: ITodoPayload) => {
    try {
      const response = await Axios.post(`/todos/create/${user_id}`, payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message ?? "API error";
    }
  },

  updateTodo: async (todo_id: number, payload: ITodoPayload) => {
    try {
      const response = await Axios.put(`/todos/update/${todo_id}`, payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message ?? "API error";
    }
  },

  deleteTodo: async (todo_id: number) => {
    try {
      const response = await Axios.delete(`/todos/delete/${todo_id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message ?? "API error";
    }
  },
};

export default TodoApi;
