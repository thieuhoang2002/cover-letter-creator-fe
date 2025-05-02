import React, { useState, useEffect } from "react";
import {
    Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Snackbar, CircularProgress, Select, MenuItem
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../apis/profile";

function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        avatarUrl: "",
        birthday: "",
        address: "",
        phone: "",
        specialization: ""
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user = null) => {
        if (user) {
            setIsEdit(true);
            setSelectedUser(user);
            setNewUser({
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                avatarUrl: user.avatarUrl,
                birthday: user.birthday,
                address: user.address,
                phone: user.phone,
                specialization: user.specialization
            });
        } else {
            setIsEdit(false);
            setNewUser({
                name: "",
                email: "",
                password: "",
                role: "",
                avatarUrl: "",
                birthday: "",
                address: "",
                phone: "",
                specialization: ""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async () => {
        try {
            if (isEdit && selectedUser) {
                await updateUser(selectedUser.id, newUser);
                setSnackbarMessage("Cập nhật thông tin người dùng thành công!");
            } else {
                await createUser(newUser);
                setSnackbarMessage("Thêm người dùng thành công!");
            }
            setSnackbarOpen(true);
            fetchUsers();
            handleCloseDialog();
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            setSnackbarMessage("Xóa người dùng thành công!");
            setSnackbarOpen(true);
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Tên người dùng", width: 180 },
        { field: "email", headerName: "Email", width: 180 },
        { field: "role", headerName: "Vai trò", width: 100 },
        {
            field: "actions",
            headerName: "Hành động",
            width: 170,
            renderCell: (params) => (
                <>
                    <Button color="primary" onClick={() => handleOpenDialog(params.row)}>
                        Chỉnh sửa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Quản lý Người Dùng
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Thêm Người Dùng Mới
            </Button>

            <Box sx={{ height: 700, width: "100%", mt: 2 }}>
                {loading ? <CircularProgress /> : <DataGrid rows={users} columns={columns} pageSize={5} />}
            </Box>

            {/* Dialog Thêm / Chỉnh sửa người dùng */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{isEdit ? "Chỉnh sửa Người dùng" : "Thêm Người dùng"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên Người Dùng"
                        fullWidth
                        margin="normal"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <TextField
                        label="Mật khẩu"
                        fullWidth
                        margin="normal"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <TextField
                        name="role"
                        fullWidth
                        select
                        label="Vai trò"
                        margin="normal"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <MenuItem value={"user"}>User</MenuItem>
                        <MenuItem value={"admin"}>Admin</MenuItem>
                    </TextField>
                    <TextField
                        label="URL ảnh đại diện"
                        fullWidth
                        margin="normal"
                        value={newUser.avatarUrl}
                        onChange={(e) => setNewUser({ ...newUser, avatarUrl: e.target.value })}
                    />
                    <TextField
                        name="birthday"
                        label="Ngày sinh"
                        fullWidth
                        margin="normal"
                        type="date"
                        value={newUser.birthday}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => setNewUser({ ...newUser, birthday: e.target.value })}
                    />
                    <TextField
                        label="Địa chỉ"
                        fullWidth
                        margin="normal"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                    <TextField
                        label="Số điện thoại"
                        fullWidth
                        margin="normal"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                    <TextField
                        label="Chuyên ngành"
                        fullWidth
                        margin="normal"
                        value={newUser.specialization}
                        onChange={(e) => setNewUser({ ...newUser, specialization: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSaveUser} color="primary">
                        {isEdit ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
}

export default UserManager;