import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Snackbar,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import Alert from "@mui/material/Alert";
import { getCurrentUser, updateCurrentUserProfile } from "../../apis/profile";

const Information = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    avatarUrl: "",
    specialization: "",
    skills: [],
    experiences: [],
    certificates: [],
    hobbies: [],
    educations: [],
  });

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          birthday: user.birthday ? user.birthday.split("T")[0] : "",
          avatarUrl: user.avatarUrl || "",
          specialization: user.specialization || "",
          skills: user.skills || [],
          experiences: user.experiences || [],
          certificates: user.certificates || [],
          hobbies: user.hobbies || [],
          educations: user.educations || [],
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setSnackbar({
          open: true,
          message: "Không thể tải thông tin người dùng",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleListChange = (field, index, key, value) => {
    setFormData((prev) => {
      const updatedList = [...prev[field]];
      updatedList[index][key] = value;
      return { ...prev, [field]: updatedList };
    });
  };

  const handleAddItem = (field, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }));
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => {
      const updatedList = [...prev[field]];
      updatedList.splice(index, 1);
      return { ...prev, [field]: updatedList };
    });
  };

  const validateForm = () => {
    const lists = [
      {
        field: "skills",
        name: "Kỹ năng",
        fields: ["name"],
      },
      {
        field: "experiences",
        name: "Kinh nghiệm làm việc",
        fields: ["company", "role", "time", "description"],
      },
      {
        field: "certificates",
        name: "Chứng chỉ",
        fields: ["name", "issuer", "issueDate"],
      },
      {
        field: "educations",
        name: "Học vấn",
        fields: ["school", "fieldOfStudy", "degree", "time"],
      },
      {
        field: "hobbies",
        name: "Sở thích",
        fields: ["name"],
      },
    ];

    for (const list of lists) {
      for (const item of formData[list.field]) {
        for (const key of list.fields) {
          if (!item[key] || item[key].trim() === "") {
            return {
              isValid: false,
              message: `Trường "${key}" trong "${list.name}" không được để trống`,
            };
          }
        }
      }
    }

    return { isValid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      setSnackbar({
        open: true,
        message: validation.message,
        severity: "error",
      });
      return;
    }

    try {
      await updateCurrentUserProfile(formData);
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setSnackbar({
        open: true,
        message: "Cập nhật thất bại",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  const renderDynamicList = (field, labelMap, defaultItem) => (
    <Box mb={2}>
      <Typography variant="h6" mt={2} mb={1}>
        {labelMap.title}
      </Typography>
      {formData[field].map((item, index) => (
        <Box key={index} mb={1} display="flex" gap={2} alignItems="center">
          {Object.keys(labelMap.fields).map((key) => (
            <TextField
              key={key}
              label={labelMap.fields[key]}
              value={item[key] || ""}
              onChange={(e) =>
                handleListChange(field, index, key, e.target.value)
              }
              size="small"
            />
          ))}
          <IconButton onClick={() => handleRemoveItem(field, index)}>
            <Delete />
          </IconButton>
        </Box>
      ))}
      <Button
        size="small"
        variant="outlined"
        startIcon={<Add />}
        onClick={() => handleAddItem(field, defaultItem)}
      >
        Thêm {labelMap.title.toLowerCase()}
      </Button>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar src={formData.avatarUrl} sx={{ width: 80, height: 80 }} />
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          label="Link Avatar"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Họ tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        <TextField
          fullWidth
          margin="normal"
          label="Số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Địa chỉ"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Ngày sinh"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Chuyên ngành"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
        />

        {renderDynamicList("skills", {
          title: "Kỹ năng",
          fields: { name: "Tên kỹ năng" },
        }, { name: "" })}

        {renderDynamicList("experiences", {
          title: "Kinh nghiệm làm việc",
          fields: {
            company: "Công ty",
            role: "Vai trò",
            time: "Thời gian",
            description: "Mô tả",
          },
        }, { company: "", role: "", time: "", description: "" })}

        {renderDynamicList("certificates", {
          title: "Chứng chỉ",
          fields: {
            name: "Tên chứng chỉ",
            issuer: "Tổ chức cấp",
            issueDate: "Ngày cấp (yyyy-mm)",
          },
        }, { name: "", issuer: "", issueDate: "" })}

        {renderDynamicList("educations", {
          title: "Học vấn",
          fields: {
            school: "Tên trường",
            fieldOfStudy: "Ngành học",
            degree: "Bằng cấp",
            time: "Thời gian",
          },
        }, { school: "", fieldOfStudy: "", degree: "", time: "" })}

        {renderDynamicList("hobbies", {
          title: "Sở thích",
          fields: { name: "Tên sở thích" },
        }, { name: "" })}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Cập nhật
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Information;