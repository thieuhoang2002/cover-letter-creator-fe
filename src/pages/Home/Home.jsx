import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function Home() {
    return (
        <Container maxWidth="lg" sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Hỗ Trợ Tạo Đơn Xin Việc
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
                Dễ dàng tạo đơn xin việc chuyên nghiệp chỉ trong vài bước đơn giản.
            </Typography>
            <Button variant="contained" color="primary" size="large" component={Link} to="/template/all" sx={{ mt: 3 }}>
                Bắt Đầu Ngay
            </Button>

            <Grid container spacing={4} sx={{ mt: 5 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <WorkOutlineIcon fontSize="large" color="primary" />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Chọn Mẫu Đơn
                            </Typography>
                            <Typography color="textSecondary">
                                Lựa chọn từ nhiều mẫu đơn chuyên nghiệp phù hợp với từng ngành nghề.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <DescriptionIcon fontSize="large" color="primary" />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Tùy Chỉnh Nội Dung
                            </Typography>
                            <Typography color="textSecondary">
                                Dễ dàng chỉnh sửa thông tin cá nhân, nội dung đơn theo nhu cầu.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <CloudDownloadIcon fontSize="large" color="primary" />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Tải Xuống & Sử Dụng
                            </Typography>
                            <Typography color="textSecondary">
                                Xuất đơn xin việc dưới dạng PDF chuyên nghiệp và sẵn sàng gửi đi.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;