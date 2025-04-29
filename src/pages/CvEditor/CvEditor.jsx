import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import initialCvData from './data_cv';
import { generateCvContent } from './content';
import {
    Grid,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CvEditor = () => {
    const [cvData, setCvData] = useState(initialCvData);
    const [editorContent, setEditorContent] = useState(generateCvContent(initialCvData));

    // State for controlling dialogs
    const [openSkillDialog, setOpenSkillDialog] = useState(false);
    const [openExperienceDialog, setOpenExperienceDialog] = useState(false);
    const [openProjectDialog, setOpenProjectDialog] = useState(false);

    // State for form inputs
    const [newSkill, setNewSkill] = useState('');
    const [newExperience, setNewExperience] = useState({
        company: '',
        role: '',
        time: '',
        desc: ''
    });
    const [newProject, setNewProject] = useState({
        name: '',
        desc: ''
    });

    // Update TinyMCE content whenever cvData changes
    useEffect(() => {
        setEditorContent(generateCvContent(cvData));
    }, [cvData]);

    // Handlers for adding/removing skills
    const handleOpenSkillDialog = () => {
        setNewSkill('');
        setOpenSkillDialog(true);
    };

    const handleCloseSkillDialog = () => {
        setOpenSkillDialog(false);
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setCvData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
        }
        setOpenSkillDialog(false);
    };

    const removeSkill = (index) => {
        setCvData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    // Handlers for adding/removing experiences
    const handleOpenExperienceDialog = () => {
        setNewExperience({ company: '', role: '', time: '', desc: '' });
        setOpenExperienceDialog(true);
    };

    const handleCloseExperienceDialog = () => {
        setOpenExperienceDialog(false);
    };

    const handleAddExperience = () => {
        if (newExperience.company.trim() && newExperience.role.trim()) {
            setCvData(prev => ({
                ...prev,
                experiences: [...prev.experiences, {
                    company: newExperience.company.trim() || "New Company",
                    role: newExperience.role.trim() || "New Role",
                    time: newExperience.time.trim() || "MM/YYYY - MM/YYYY",
                    desc: newExperience.desc.trim() || "Description of the role.",
                }],
            }));
        }
        setOpenExperienceDialog(false);
    };

    const removeExperience = (index) => {
        setCvData(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index),
        }));
    };

    // Handlers for adding/removing projects
    const handleOpenProjectDialog = () => {
        setNewProject({ name: '', desc: '' });
        setOpenProjectDialog(true);
    };

    const handleCloseProjectDialog = () => {
        setOpenProjectDialog(false);
    };

    const handleAddProject = () => {
        if (newProject.name.trim()) {
            setCvData(prev => ({
                ...prev,
                projects: [...prev.projects, {
                    name: newProject.name.trim() || "New Project",
                    desc: newProject.desc.trim() || "Project description.",
                }],
            }));
        }
        setOpenProjectDialog(false);
    };

    const removeProject = (index) => {
        setCvData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index),
        }));
    };

    const handleEditorChange = (content) => {
        console.log('Content updated:', content);
    };

    return (
        <Grid container spacing={2} sx={{ padding: '20px', height: '100vh' }}>
            {/* Left Side: TinyMCE Editor */}
            <Grid item xs={12} md={9}>
                <Typography variant="h5" align="center" gutterBottom>
                    CV Preview
                </Typography>
                <Editor
                    apiKey="your-tinymce-api-key"
                    init={{
                        height: '80vh',
                        menubar: true,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar:
                            'undo redo | formatselect | bold italic | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help'
                    }}
                    value={editorContent}
                    onEditorChange={handleEditorChange}
                />
            </Grid>

            {/* Right Side: Controls */}
            <Grid item xs={12} md={3}>
                <Paper elevation={3} sx={{ padding: '15px', height: '100%', overflowY: 'auto' }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        CV Controls
                    </Typography>

                    {/* Skills Section */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f5f5f5' }}>
                            <Typography variant="subtitle1" color="primary">
                                Kỹ năng
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                {cvData.skills.map((skill, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() => removeSkill(index)}
                                                sx={{ minWidth: '30px', padding: '2px' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        }
                                    >
                                        <ListItemText primary={skill} />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<AddIcon />}
                                onClick={handleOpenSkillDialog}
                                fullWidth
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                Thêm kỹ năng
                            </Button>
                        </AccordionDetails>
                    </Accordion>

                    {/* Experiences Section */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f5f5f5' }}>
                            <Typography variant="subtitle1" color="primary">
                                Kinh nghiệm
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                {cvData.experiences.map((exp, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() => removeExperience(index)}
                                                sx={{ minWidth: '30px', padding: '2px' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={`${exp.role} tại ${exp.company}`}
                                            secondary={`(${exp.time})`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<AddIcon />}
                                onClick={handleOpenExperienceDialog}
                                fullWidth
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                Thêm kinh nghiệm
                            </Button>
                        </AccordionDetails>
                    </Accordion>

                    {/* Projects Section */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f5f5f5' }}>
                            <Typography variant="subtitle1" color="primary">
                                Dự án
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                {cvData.projects.map((project, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() => removeProject(index)}
                                                sx={{ minWidth: '30px', padding: '2px' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        }
                                    >
                                        <ListItemText primary={project.name} />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<AddIcon />}
                                onClick={handleOpenProjectDialog}
                                fullWidth
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                Thêm dự án
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            </Grid>

            {/* Dialog for Adding Skill */}
            <Dialog open={openSkillDialog} onClose={handleCloseSkillDialog}>
                <DialogTitle>Thêm kỹ năng mới</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên kỹ năng"
                        fullWidth
                        variant="outlined"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSkillDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddSkill} color="primary" variant="contained">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Adding Experience */}
            <Dialog open={openExperienceDialog} onClose={handleCloseExperienceDialog}>
                <DialogTitle>Thêm kinh nghiệm mới</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên công ty"
                        fullWidth
                        variant="outlined"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label="Vị trí"
                        fullWidth
                        variant="outlined"
                        value={newExperience.role}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, role: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label="Thời gian (VD: 06/2023 - 12/2023)"
                        fullWidth
                        variant="outlined"
                        value={newExperience.time}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, time: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label="Mô tả"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={newExperience.desc}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, desc: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExperienceDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddExperience} color="primary" variant="contained">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Adding Project */}
            <Dialog open={openProjectDialog} onClose={handleCloseProjectDialog}>
                <DialogTitle>Thêm dự án mới</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên dự án"
                        fullWidth
                        variant="outlined"
                        value={newProject.name}
                        onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label="Mô tả"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={newProject.desc}
                        onChange={(e) => setNewProject(prev => ({ ...prev, desc: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProjectDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddProject} color="primary" variant="contained">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default CvEditor;