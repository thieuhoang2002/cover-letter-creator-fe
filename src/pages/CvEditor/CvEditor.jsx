import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Divider,
    TextField,
    IconButton,
    Button,
    Stack,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import initialCvData from "./data_cv";

// Hàm giả lập API AI
const fetchAiSuggestions = async (cvData) => {
    // Giả lập AI gợi ý dựa trên dữ liệu CV (Ví dụ dùng OpenAI GPT hoặc mô hình NLP)
    return new Promise((resolve) => {
        setTimeout(() => {
            const suggestions = {
                summary: "Tôi là một lập trình viên phần mềm đam mê công nghệ, luôn tìm kiếm cơ hội học hỏi và phát triển các sản phẩm sáng tạo.",
                skills: "Java, Python, JavaScript, React, Node.js, SQL, Git",
                experience: "Kinh nghiệm làm việc trong lĩnh vực phát triển phần mềm với các dự án về ứng dụng web và di động.",
            };
            resolve(suggestions);
        }, 1000);
    });
};

export default function CvEditor() {
    const [cvData, setCvData] = useState(initialCvData);

    // Các state phụ để thêm mới
    const [newSkill, setNewSkill] = useState("");
    const [newExp, setNewExp] = useState({ role: "", company: "", time: "", desc: "" });
    const [newProject, setNewProject] = useState({ name: "", desc: "" });
    const [newSchool, setNewSchool] = useState({ school: "", major: "", year: "" });
    const [aiSuggestions, setAiSuggestions] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateSuggestions = async () => {
        setIsLoading(true);
        const suggestions = await fetchAiSuggestions(cvData);
        setAiSuggestions(suggestions);
        setIsLoading(false);
    };

    const handleInputChange = (field, value) => {
        setCvData({ ...cvData, [field]: value });
    };

    const handleContactChange = (field, value) => {
        setCvData({ ...cvData, contact: { ...cvData.contact, [field]: value } });
    };

    const handleEducationChange = (field, value) => {
        setCvData({ ...cvData, education: { ...cvData.education, [field]: value } });
    };

    const handleAddEducation = () => {
        if (newSchool.school && newSchool.major && newSchool.year) {
            setCvData({
                ...cvData,
                education: [...cvData.education, newSchool],
            });
            setNewSchool({ school: "", major: "", year: "" });
        }
    };

    const handleDeleteEducation = (index) => {
        const updated = [...cvData.education];
        updated.splice(index, 1);
        setCvData({ ...cvData, education: updated });
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setCvData({ ...cvData, skills: [...cvData.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const handleDeleteSkill = (index) => {
        const updatedSkills = [...cvData.skills];
        updatedSkills.splice(index, 1);
        setCvData({ ...cvData, skills: updatedSkills });
    };

    const handleAddExperience = () => {
        if (newExp.role && newExp.company) {
            setCvData({ ...cvData, experiences: [...cvData.experiences, newExp] });
            setNewExp({ role: "", company: "", time: "", desc: "" });
        }
    };

    const handleDeleteExperience = (index) => {
        const updated = [...cvData.experiences];
        updated.splice(index, 1);
        setCvData({ ...cvData, experiences: updated });
    };

    const handleAddProject = () => {
        if (newProject.name && newProject.desc) {
            setCvData({ ...cvData, projects: [...cvData.projects, newProject] });
            setNewProject({ name: "", desc: "" });
        }
    };

    const handleDeleteProject = (index) => {
        const updated = [...cvData.projects];
        updated.splice(index, 1);
        setCvData({ ...cvData, projects: updated });
    };

    return (
        <Box p={4} maxWidth="900px" margin="auto">
            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    {/* Left */}
                    <Grid item xs={12} md={4}>
                        <Box textAlign="center">
                            <Avatar src={cvData.avatarUrl} sx={{ width: 120, height: 120, margin: "auto" }} />
                            <TextField
                                label="Link Avatar"
                                variant="standard"
                                fullWidth
                                value={cvData.avatarUrl}
                                onChange={(e) => handleInputChange("avatarUrl", e.target.value)}
                                sx={{ mt: 2 }}
                            />
                        </Box>

                        <Box mt={3}>
                            <TextField
                                label="Tên"
                                variant="standard"
                                fullWidth
                                value={cvData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                            <TextField
                                label="Chức danh"
                                variant="standard"
                                fullWidth
                                value={cvData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                sx={{ mt: 2 }}
                            />
                        </Box>

                        <Box mt={4}>
                            <Typography variant="subtitle2">Liên hệ</Typography>
                            <Divider sx={{ mb: 1 }} />
                            <TextField
                                label="Email"
                                variant="standard"
                                fullWidth
                                value={cvData.contact.email}
                                onChange={(e) => handleContactChange("email", e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Số điện thoại"
                                variant="standard"
                                fullWidth
                                value={cvData.contact.phone}
                                onChange={(e) => handleContactChange("phone", e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Địa chỉ"
                                variant="standard"
                                fullWidth
                                value={cvData.contact.address}
                                onChange={(e) => handleContactChange("address", e.target.value)}
                            />
                        </Box>

                        <Box mt={4}>
                            <Typography variant="subtitle2">Kỹ năng</Typography>
                            <Divider sx={{ mb: 1 }} />
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {cvData.skills.map((skill, index) => (
                                    <Button
                                        key={index}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleDeleteSkill(index)}
                                    >
                                        {skill} ❌
                                    </Button>
                                ))}
                            </Stack>
                            <Box display="flex" gap={1} mt={1}>
                                <TextField
                                    label="Thêm kỹ năng"
                                    size="small"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                />
                                <IconButton color="primary" onClick={handleAddSkill}>
                                    <Add />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right */}
                    <Grid item xs={12} md={8}>
                        {/* Kinh nghiệm */}
                        <Box>
                            <Typography variant="h6">Kinh nghiệm làm việc</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {cvData.experiences.map((exp, index) => (
                                <Box key={index} mb={2}>
                                    <Typography fontWeight="bold">{exp.role}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {exp.company} | {exp.time}
                                    </Typography>
                                    <Typography variant="body2">{exp.desc}</Typography>
                                    <Button size="small" color="error" onClick={() => handleDeleteExperience(index)}>
                                        Xoá
                                    </Button>
                                </Box>
                            ))}
                            <Box mt={2}>
                                <TextField
                                    label="Chức vụ"
                                    size="small"
                                    fullWidth
                                    value={newExp.role}
                                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Công ty"
                                    size="small"
                                    fullWidth
                                    value={newExp.company}
                                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Thời gian"
                                    size="small"
                                    fullWidth
                                    value={newExp.time}
                                    onChange={(e) => setNewExp({ ...newExp, time: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Mô tả"
                                    size="small"
                                    fullWidth
                                    multiline
                                    value={newExp.desc}
                                    onChange={(e) => setNewExp({ ...newExp, desc: e.target.value })}
                                />
                                <Button onClick={handleAddExperience} variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    Thêm Kinh Nghiệm
                                </Button>
                            </Box>
                        </Box>

                        {/* Dự án */}
                        <Box mt={4}>
                            <Typography variant="h6">Dự án cá nhân</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {cvData.projects.map((proj, index) => (
                                <Box key={index} mb={2}>
                                    <Typography fontWeight="bold">{proj.name}</Typography>
                                    <Typography variant="body2">{proj.desc}</Typography>
                                    <Button size="small" color="error" onClick={() => handleDeleteProject(index)}>
                                        Xoá
                                    </Button>
                                </Box>
                            ))}
                            <Box mt={2}>
                                <TextField
                                    label="Tên dự án"
                                    size="small"
                                    fullWidth
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Mô tả"
                                    size="small"
                                    fullWidth
                                    multiline
                                    value={newProject.desc}
                                    onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                                />
                                <Button onClick={handleAddProject} variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    Thêm Dự Án
                                </Button>
                            </Box>
                        </Box>

                        {/* Học vấn */}
                        <Box mt={4}>
                            <Typography variant="h6">Học vấn</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {cvData.education.map((edu, index) => (
                                <Box key={index} mb={2}>
                                    <Typography fontWeight="bold">{edu.school}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {edu.major} | {edu.year}
                                    </Typography>
                                    <Button size="small" color="error" onClick={() => handleDeleteEducation(index)}>
                                        Xoá
                                    </Button>
                                </Box>
                            ))}
                            <Box mt={2}>
                                <TextField
                                    label="Tên trường"
                                    size="small"
                                    fullWidth
                                    value={newSchool.school}
                                    onChange={(e) => setNewSchool({ ...newSchool, school: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Ngành học"
                                    size="small"
                                    fullWidth
                                    value={newSchool.major}
                                    onChange={(e) => setNewSchool({ ...newSchool, major: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Năm học"
                                    size="small"
                                    fullWidth
                                    value={newSchool.year}
                                    onChange={(e) => setNewSchool({ ...newSchool, year: e.target.value })}
                                />
                                <Button onClick={handleAddEducation} variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    Thêm Trường Học
                                </Button>
                            </Box>
                        </Box>
                        {/* Gợi ý AI */}
                        <Box mt={4}>
                            <Typography variant="h6">Gợi ý AI</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {isLoading ? (
                                <Typography variant="body2" color="text.secondary">
                                    Đang tải gợi ý từ AI...
                                </Typography>
                            ) : (
                                <>
                                    <Box mt={2}>
                                        <Typography variant="body2" fontWeight="bold">
                                            Gợi ý về tóm tắt:
                                        </Typography>
                                        <Typography variant="body2">{aiSuggestions.summary}</Typography>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2" fontWeight="bold">
                                            Gợi ý về kỹ năng:
                                        </Typography>
                                        <Typography variant="body2">{aiSuggestions.skills}</Typography>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2" fontWeight="bold">
                                            Gợi ý về kinh nghiệm:
                                        </Typography>
                                        <Typography variant="body2">{aiSuggestions.experience}</Typography>
                                    </Box>
                                </>
                            )}
                            <Button
                                onClick={handleGenerateSuggestions}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            >
                                Gợi ý từ AI
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
