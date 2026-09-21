import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const ThemeModeContext = createContext({
    mode: 'light',
    toggleTheme: () => {}
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const CustomThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        return localStorage.getItem('themeMode') || 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => {
        const isDark = mode === 'dark';
        return createTheme({
            palette: {
                mode,
                primary: {
                    main: isDark ? '#3b82f6' : '#2563eb',
                    light: '#60a5fa',
                    dark: '#1d4ed8',
                    contrastText: '#ffffff'
                },
                secondary: {
                    main: isDark ? '#a855f7' : '#7c3aed',
                    light: '#c084fc',
                    dark: '#6d28d9'
                },
                background: {
                    default: isDark ? '#090d16' : '#f8fafc',
                    paper: isDark ? '#111827' : '#ffffff'
                },
                text: {
                    primary: isDark ? '#f1f5f9' : '#0f172a',
                    secondary: isDark ? '#94a3b8' : '#64748b'
                },
                divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
            },
            typography: {
                fontFamily: [
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    'sans-serif'
                ].join(','),
                h1: { fontWeight: 800, letterSpacing: '-0.025em' },
                h2: { fontWeight: 800, letterSpacing: '-0.025em' },
                h3: { fontWeight: 700, letterSpacing: '-0.02em' },
                h4: { fontWeight: 700, letterSpacing: '-0.02em' },
                h5: { fontWeight: 600 },
                h6: { fontWeight: 600 },
                button: { textTransform: 'none', fontWeight: 600 }
            },
            shape: {
                borderRadius: 12
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10,
                            padding: '8px 20px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: 'none',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                            }
                        }
                    }
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            borderRadius: 16,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: isDark
                                ? '1px solid rgba(255, 255, 255, 0.08)'
                                : '1px solid rgba(0, 0, 0, 0.06)',
                            boxShadow: isDark
                                ? '0 4px 20px rgba(0, 0, 0, 0.4)'
                                : '0 4px 20px rgba(0, 0, 0, 0.04)'
                        }
                    }
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundImage: 'none'
                        }
                    }
                }
            }
        });
    }, [mode]);

    return (
        <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};
