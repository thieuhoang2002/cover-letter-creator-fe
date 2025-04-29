import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Home() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '40px'
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper elevation={0} sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
          mb: 6,
          position: 'relative'
        }}>
          <Box sx={{
            padding: { xs: 4, md: 6 },
            color: 'white',
            textAlign: 'left',
            position: 'relative',
            zIndex: 2
          }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                  TẠO ĐƠN XIN VIỆC CHUYÊN NGHIỆP
                </Typography>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  mt: 1
                }}>
                  Hỗ Trợ Tạo Đơn Xin Việc <Box component="span" sx={{ color: '#ffd54f' }}>Chuyên Nghiệp</Box>
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontWeight: 'normal' }}>
                  Dễ dàng tạo đơn xin việc chuyên nghiệp chỉ trong vài bước đơn giản, giúp bạn tăng cơ hội được phỏng vấn.
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/template/all"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: '#2193b0',
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      }
                    }}
                  >
                    Bắt Đầu Ngay
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                  <Box sx={{ display: 'flex', mr: 1 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} sx={{ color: '#ffd54f', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Được tin dùng bởi hơn 10.000+ người dùng
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box
                  component="img"
                  src="/ChatGPT_image.png"
                  alt="Document preview"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transform: 'perspective(1000px) rotateY(-10deg)',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Features Section */}
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 1
        }}>
          Quy Trình Đơn Giản
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{
          textAlign: 'center',
          maxWidth: '700px',
          mx: 'auto',
          mb: 5
        }}>
          Chỉ với ba bước đơn giản, bạn sẽ có một đơn xin việc chuyên nghiệp
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            {
              icon: <WorkOutlineIcon fontSize="large" sx={{ fontSize: 40 }} />,
              title: "Chọn Mẫu Đơn",
              description: "Lựa chọn từ nhiều mẫu đơn chuyên nghiệp phù hợp với từng ngành nghề.",
              color: "#3f51b5"
            },
            {
              icon: <DescriptionIcon fontSize="large" sx={{ fontSize: 40 }} />,
              title: "Tùy Chỉnh Nội Dung",
              description: "Dễ dàng chỉnh sửa thông tin cá nhân, nội dung đơn theo nhu cầu.",
              color: "#009688"
            },
            {
              icon: <CloudDownloadIcon fontSize="large" sx={{ fontSize: 40 }} />,
              title: "Tải Xuống & Sử Dụng",
              description: "Xuất đơn xin việc dưới dạng PDF chuyên nghiệp và sẵn sàng gửi đi.",
              color: "#ff5722"
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{
                borderRadius: 4,
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }
              }}>
                <CardContent sx={{
                  padding: 4,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Avatar sx={{
                    bgcolor: `${feature.color}15`,
                    color: feature.color,
                    width: 80,
                    height: 80,
                    mb: 2
                  }}>
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="textSecondary" variant="body1">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Paper sx={{
          borderRadius: 4,
          overflow: 'hidden',
          mt: 6,
          background: 'linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%)',
          textAlign: 'center',
          py: 6,
          px: 3
        }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
            Sẵn sàng tạo đơn xin việc của bạn?
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Hãy bắt đầu ngay hôm nay và tăng cơ hội thành công cho hồ sơ xin việc của bạn
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/template/all"
            sx={{
              fontWeight: 'bold',
              py: 1.5,
              px: 4,
              bgcolor: 'white',
              color: '#3949ab',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Tạo Đơn Ngay
          </Button>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
          <Typography variant="body2">
            © 2025 Hỗ Trợ Tạo Đơn Xin Việc. Tất cả các quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;