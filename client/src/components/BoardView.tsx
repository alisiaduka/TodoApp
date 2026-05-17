import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ITodo } from "../models/models";

type Priority = "Later" | "Normal" | "Important" | "Urgent";

interface BoardViewProps {
  todos: ITodo[];
  onDropTodo: (todo: ITodo, priority: Priority) => void;
}

const priorities: Priority[] = ["Later", "Normal", "Important", "Urgent"];

const priorityStyles: Record<
  Priority,
  { accent: string; soft: string; text: string; border: string }
> = {
  Later: {
    accent: "#8b6b52",
    soft: "#f2ece6",
    text: "#5f4736",
    border: "rgba(139,107,82,0.22)",
  },
  Normal: {
    accent: "#2f6db2",
    soft: "#e8f1ff",
    text: "#214f82",
    border: "rgba(47,109,178,0.22)",
  },
  Important: {
    accent: "#c17a00",
    soft: "#fff3dc",
    text: "#9b6200",
    border: "rgba(193,122,0,0.22)",
  },
  Urgent: {
    accent: "#c1493d",
    soft: "#fde9e6",
    text: "#9c392f",
    border: "rgba(193,73,61,0.22)",
  },
};

const BoardView = ({ todos, onDropTodo }: BoardViewProps) => {
  const groupedTodos = priorities.reduce<Record<Priority, ITodo[]>>(
    (acc, priority) => {
      acc[priority] = todos.filter((todo) => todo.priority === priority);
      return acc;
    },
    {
      Later: [],
      Normal: [],
      Important: [],
      Urgent: [],
    }
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {priorities.map((priority) => {
        const style = priorityStyles[priority];
        const items = groupedTodos[priority];

        return (
          <Paper
            key={priority}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const rawTodo = event.dataTransfer.getData("application/json");
              if (!rawTodo) return;
              const todo = JSON.parse(rawTodo) as ITodo;
              onDropTodo(todo, priority);
            }}
            elevation={0}
            sx={{
              minHeight: 420,
              p: 2,
              borderRadius: "8px",
              border: `1px solid ${style.border}`,
              background: `linear-gradient(180deg, ${style.soft}, rgba(255,250,245,0.96))`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                pb: 1.5,
                borderBottom: `1px solid ${style.border}`,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: style.text }}>
                {priority}
              </Typography>
              <Chip
                label={items.length}
                size="small"
                sx={{
                  bgcolor: style.accent,
                  color: "#fff",
                  fontWeight: 700,
                }}
              />
            </Box>

            <Stack spacing={1.5}>
              {items.map((todo) => (
                <Paper
                  key={todo.todo_id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "application/json",
                      JSON.stringify(todo)
                    );
                  }}
                  elevation={0}
                  sx={{
                    p: 2,
                    cursor: "grab",
                    borderRadius: "8px",
                    border: `1px solid ${style.border}`,
                    backgroundColor: "rgba(255,255,255,0.82)",
                    boxShadow: "0 10px 24px rgba(74,49,31,0.06)",
                    transition: "transform 140ms ease, box-shadow 140ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 14px 28px rgba(74,49,31,0.1)",
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#3f2a1c", mb: 0.6 }}>
                    {todo.task_name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(63,42,28,0.72)",
                      fontSize: 14,
                      lineHeight: 1.45,
                      mb: 1.5,
                    }}
                  >
                    {todo.description}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "rgba(63,42,28,0.52)" }}>
                    {new Date(todo.timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              ))}

              {items.length === 0 && (
                <Box
                  sx={{
                    borderRadius: "8px",
                    border: `1px dashed ${style.border}`,
                    p: 2.5,
                    textAlign: "center",
                    color: "rgba(63,42,28,0.52)",
                    backgroundColor: "rgba(255,255,255,0.45)",
                  }}
                >
                  Drop a task here
                </Box>
              )}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};

export default BoardView;
