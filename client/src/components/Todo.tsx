import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Modal,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { ITodo } from "../models/models";
import "./styles.css";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 520px)",
  borderRadius: "8px",
  bgcolor: "#fffaf5",
  border: "1px solid rgba(140,90,55,0.18)",
  boxShadow: "0 25px 70px rgba(53,34,21,0.2)",
  p: 4,
};

interface TodoProps {
  todo: ITodo;
  handleDelete: (todo_id: number) => void;
  handleUpdate: (todo: ITodo) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return { bg: "#fde7e4", color: "#b63e2f" };
    case "Important":
      return { bg: "#fff2d9", color: "#b57100" };
    case "Normal":
      return { bg: "#e4f0ff", color: "#295ea8" };
    default:
      return { bg: "#ece7e2", color: "#75563b" };
  }
};

const Todo = ({ todo, handleDelete, handleUpdate }: TodoProps) => {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState(todo.task_name);
  const [description, setDescription] = useState(todo.description);
  const [priority, setPriority] = useState(todo.priority);

  const priorityStyle = useMemo(() => getPriorityColor(todo.priority), [todo.priority]);

  return (
    <TableRow hover sx={{ "& td": { py: 2 } }}>
      <TableCell align="center">
        <Chip
          label={todo.priority}
          sx={{
            bgcolor: priorityStyle.bg,
            color: priorityStyle.color,
            fontWeight: 700,
          }}
        />
      </TableCell>
      <TableCell align="center" sx={{ fontWeight: 600 }}>
        {todo.task_name}
      </TableCell>
      <TableCell align="center" sx={{ color: "rgba(55,39,28,0.78)" }}>
        {todo.description}
      </TableCell>
      <TableCell align="center" sx={{ color: "rgba(55,39,28,0.68)" }}>
        {new Date(todo.timestamp).toLocaleString()}
      </TableCell>
      <TableCell align="center">
        <Button onClick={() => setOpen(true)} className="edit-btn">
          <EditNoteIcon />
        </Button>
        <Button onClick={() => handleDelete(todo.todo_id)} className="delete-btn">
          <DeleteIcon />
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              Edit Todo
            </Typography>
            <Typography sx={{ mb: 3, color: "rgba(55,39,28,0.72)" }}>
              Update the text or priority without leaving the dashboard.
            </Typography>
            <TextField
              fullWidth
              label="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              helperText="Use Later, Normal, Important, or Urgent"
            />
            <Button
              onClick={() => {
                handleUpdate({
                  ...todo,
                  task_name: taskName,
                  description,
                  priority,
                });
                setOpen(false);
              }}
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.4 }}
              className="sign-in-btn"
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
      </TableCell>
    </TableRow>
  );
};

export default Todo;
