import { useCallback, useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  List,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import TodoApi from "../api/todosApi";
import { AppBarProps, ITodo } from "../models/models";
import { mainListItems } from "./listItems";
import BoardView from "./BoardView";
import Logout from "./Logout";
import TodoList from "./TodoList";

const drawerWidth = 240;
const createTaskModalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 560px)",
  borderRadius: "8px",
  bgcolor: "#fffaf5",
  border: "1px solid rgba(140,90,55,0.18)",
  boxShadow: "0 25px 70px rgba(53,34,21,0.2)",
  p: 4,
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(90deg, #8c5a37, #b78352)",
  boxShadow: "0 10px 30px rgba(74,49,31,0.18)",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    background: "#fbf7f2",
    borderRight: "1px solid rgba(140,90,55,0.08)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(8),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const theme = createTheme({
  palette: {
    primary: { main: "#8c5a37" },
    background: { default: "#f4ede4", paper: "#fffaf5" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
  },
});

const priorities = ["Later", "Normal", "Important", "Urgent"];

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "board">("table");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("Later");
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [error, setError] = useState("");

  const userId = Number(localStorage.getItem("user_id"));
  const userName = localStorage.getItem("user_name") || "there";

  const summary = useMemo(
    () => ({
      total: todos.length,
      urgent: todos.filter((todo) => todo.priority === "Urgent").length,
      important: todos.filter((todo) => todo.priority === "Important").length,
    }),
    [todos],
  );

  const loadTodos = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await TodoApi.getTodoByUserId(userId);
      setTodos(response.todo);
    } catch (err: any) {
      setError(String(err));
    }
  }, [userId]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const createTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!taskName.trim() || !description.trim()) {
      setError("Task name and description are required.");
      return;
    }

    try {
      await TodoApi.createTodo(userId, {
        task_name: taskName,
        description,
        priority: selectedPriority,
      });
      setIsCreateModalOpen(false);
      setTaskName("");
      setDescription("");
      setSelectedPriority("Later");
      await loadTodos();
    } catch (err: any) {
      setError(String(err));
    }
  };

  const handleUpdate = async (todo: ITodo) => {
    try {
      await TodoApi.updateTodo(todo.todo_id, {
        task_name: todo.task_name,
        description: todo.description,
        priority: todo.priority,
      });
      await loadTodos();
    } catch (err: any) {
      setError(String(err));
    }
  };

  const handleDelete = async (todo_id: number) => {
    try {
      await TodoApi.deleteTodo(todo_id);
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.todo_id !== todo_id),
      );
    } catch (err: any) {
      setError(String(err));
    }
  };

  const handleDropTodo = async (
    todo: ITodo,
    priority: "Later" | "Normal" | "Important" | "Urgent",
  ) => {
    if (todo.priority === priority) {
      return;
    }

    try {
      await TodoApi.updateTodo(todo.todo_id, {
        task_name: todo.task_name,
        description: todo.description,
        priority,
      });
      await loadTodos();
    } catch (err: any) {
      setError(String(err));
    }
  };

  const toggleDrawer = () => setOpen((current) => !current);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setError("");
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setSelectedPriority(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", background: "#f4ede4" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: 3 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ mr: 2.5, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography component="h1" variant="h6" sx={{ fontWeight: 700 }}>
                Welcome back, {userName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.84 }}>
                Organize today’s tasks without losing the simple layout you
                already have.
              </Typography>
            </Box>
            <Logout />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems({
              viewMode,
              onChangeView: setViewMode,
            })}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            px: { xs: 2, sm: 4 },
            py: { xs: 10, sm: 12 },
            background:
              "radial-gradient(circle at top right, rgba(199,156,108,0.14), transparent 28%), linear-gradient(180deg, #f7f1ea, #f2e7da)",
          }}
        >
          <Grid container spacing={3} sx={{ maxWidth: 1500, mx: "auto" }}>
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(140,90,55,0.12)",
                  boxShadow: "0 30px 70px rgba(79,52,33,0.09)",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: "#3f2a1c" }}
                      >
                        Your Todo Dashboard
                      </Typography>
                      <Typography sx={{ color: "rgba(63,42,28,0.72)", mt: 1 }}>
                        Add tasks quickly, scan priorities, and keep the
                        workspace uncluttered.
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip label={`${summary.total} total`} />
                      <Chip
                        label={`${summary.urgent} urgent`}
                        color="error"
                        variant="outlined"
                      />
                      <Chip
                        label={`${summary.important} important`}
                        sx={{ borderColor: "#b78352", color: "#8c5a37" }}
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: { xs: 2, sm: 2.5 },
                          borderRadius: "8px",
                          border: "1px solid rgba(140,90,55,0.12)",
                          background:
                            "linear-gradient(180deg, rgba(199,156,108,0.1), rgba(255,250,245,0.98))",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <EventNoteIcon sx={{ color: "#8c5a37" }} />
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Tasks
                              </Typography>
                              <Typography
                                sx={{
                                  color: "rgba(63,42,28,0.68)",
                                  fontSize: 14,
                                }}
                              >
                                Create a new task from here without leaving the
                                table view.
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            onClick={openCreateModal}
                            variant="contained"
                            sx={{ py: 1.2, px: 2.5, whiteSpace: "nowrap" }}
                            className="sign-in-btn"
                          >
                            Create Task
                            <AddIcon sx={{ ml: 1 }} />
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      {viewMode === "table" ? (
                        <TodoList
                          todos={todos}
                          handleDelete={handleDelete}
                          handleUpdate={handleUpdate}
                        />
                      ) : (
                        <BoardView todos={todos} onDropTodo={handleDropTodo} />
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Modal open={isCreateModalOpen} onClose={closeCreateModal}>
            <Box sx={createTaskModalStyle}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 1, color: "#3f2a1c" }}
              >
                Create Task
              </Typography>
              <Typography sx={{ color: "rgba(63,42,28,0.72)", mb: 3 }}>
                Add the task details and choose the right priority before saving
                it.
              </Typography>
              <Box component="form" onSubmit={createTodo}>
                <TextField
                  fullWidth
                  label="Task Name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  sx={{ mb: 2 }}
                  autoFocus
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Task Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1, color: "#6d5139" }}>
                    Priority
                  </FormLabel>
                  <Select
                    value={selectedPriority}
                    onChange={handlePriorityChange}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {error && (
                  <Typography sx={{ color: "#b63e2f", mb: 2, fontSize: 14 }}>
                    {error}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "flex-end",
                    mt: 3,
                  }}
                >
                  <Button
                    onClick={closeCreateModal}
                    color="inherit"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="sign-in-btn"
                  >
                    Save Task
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
