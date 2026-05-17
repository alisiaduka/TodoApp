import React from "react";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

interface SidebarItemsProps {
  viewMode: "table" | "board";
  onChangeView: (view: "table" | "board") => void;
}

export const mainListItems = ({
  viewMode,
  onChangeView,
}: SidebarItemsProps) => (
  <React.Fragment>
    <ListSubheader component="div" inset sx={{ bgcolor: "transparent" }}>
      Views
    </ListSubheader>
    <ListItemButton
      selected={viewMode === "table"}
      onClick={() => onChangeView("table")}
    >
      <ListItemIcon>
        <TableRowsIcon />
      </ListItemIcon>
      <ListItemText primary="List View" secondary="Classic table layout" />
    </ListItemButton>
    <ListItemButton
      selected={viewMode === "board"}
      onClick={() => onChangeView("board")}
    >
      <ListItemIcon>
        <ViewKanbanIcon />
      </ListItemIcon>
      <ListItemText primary="Board View" secondary="Drag tasks by priority" />
    </ListItemButton>
  </React.Fragment>
);
