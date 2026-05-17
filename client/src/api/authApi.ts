import Axios from "./axios";
import { IAuthResponse } from "../models/models";

const Api = {
  register: async (user_name: string, email: string, password: string) => {
    try {
      const response = await Axios.post<IAuthResponse>("/auth/register", {
        user_name,
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message ?? "API error";
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await Axios.post<IAuthResponse>("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message ?? "API error";
    }
  },

  logout: async () => {
    try {
      await Axios.post("/auth/logout");
    } catch (error: any) {
      throw error.response?.data?.message ?? "API error";
    }
  },
};

export default Api;
