import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ITodo } from "../models/models";
import Todo from "./Todo";

interface TodoListProps {
  todos: ITodo[];
  handleDelete: (todo_id: number) => void;
  handleUpdate: (todo: ITodo) => void;
}

const TodoList = ({ todos, handleDelete, handleUpdate }: TodoListProps) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid rgba(140,90,55,0.12)",
        boxShadow: "0 18px 50px rgba(82,53,33,0.08)",
      }}
    >
      <Table sx={{ minWidth: 1200 }} size="small" aria-label="todo table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(199,156,108,0.12)" }}>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Priority
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Task
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Description
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Created
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo) => (
            <Todo
              key={todo.todo_id}
              todo={todo}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TodoList;
