import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingFallback() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                }}
            >
                <CircularProgress
                    size={48}
                    thickness={4}
                    sx={{
                        color: '#10b981',
                        animationDuration: '750ms',
                    }}
                />
            </Box>
            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    letterSpacing: 0.5,
                }}
            >
                Đang tải dữ liệu...
            </Typography>
        </Box>
    );
}
