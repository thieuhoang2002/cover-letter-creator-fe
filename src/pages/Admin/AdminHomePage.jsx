import React, { useState } from "react";
import { Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, People, Settings, Article } from "@mui/icons-material";
import TemplateManager from "./TemplateManager"; // Import TemplateManager
import AdminDashboard from "./AdminDashboard";

const drawerWidth = 240;

function AdminHomePage() {
    const [selectedPage, setSelectedPage] = useState("dashboard");

    return (
        <Box sx={{ position: 'static', display: 'flex' }}>
            <CssBaseline />

            {/* Sidebar */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#1e1e2d", color: "white", position: "static", height: "100vh" },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <List>
                    <ListItem onClick={() => setSelectedPage("dashboard")} sx={{ cursor: "pointer" }}>
                        <ListItemIcon sx={{ color: "white" }}><Dashboard /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    {/* <ListItem onClick={() => setSelectedPage("users")} sx={{ cursor: "pointer" }}>
                        <ListItemIcon sx={{ color: "white" }}><People /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem> */}
                    <ListItem onClick={() => setSelectedPage("templates")} sx={{ cursor: "pointer" }}>
                        <ListItemIcon sx={{ color: "white" }}><Article /></ListItemIcon>
                        <ListItemText primary="Templates" />
                    </ListItem>
                    {/* <ListItem onClick={() => setSelectedPage("settings")} sx={{ cursor: "pointer" }}>
                        <ListItemIcon sx={{ color: "white" }}><Settings /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem> */}
                </List>
            </Drawer>

            {/* Nội dung chính */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />

                {selectedPage === "dashboard" && <AdminDashboard />}
                {selectedPage === "templates" && <TemplateManager />}
            </Box>
        </Box>
    );
}

export default AdminHomePage;
