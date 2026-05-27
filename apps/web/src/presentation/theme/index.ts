import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1D4ED8',
    },
    success: { main: '#16A34A' },
    error:   { main: '#DC2626' },
    warning: { main: '#D97706' },
    info:    { main: '#0891B2' },
    background: {
      default: '#F9FAFB',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#111827',
      secondary: '#4B5563',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #E5E7EB', borderRadius: 12 },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
  },
})

export const CHART_COLORS = ['#2563EB', '#16A34A', '#D97706', '#9333EA', '#0891B2']
