import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoByUserId,
} from "../controllers/todoController";
import { Router } from "express";

const router = Router();


router.get('/get', getAllTodos);
router.get('/get/user/:user_id', getTodoByUserId)
router.post('/create/:user_id', createTodo)
router.put('/update/:todo_id', updateTodo)
router.delete('/delete/:todo_id', deleteTodo)

export default router;