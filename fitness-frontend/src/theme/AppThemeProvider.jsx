// This provider supplies the fitness color palette and persists the user's light/dark mode choice.
import { createContext, useContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const ThemeModeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('fitness-theme') || 'light');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#167c80' },
          secondary: { main: '#f47c48' },
          background: { default: mode === 'light' ? '#f5f8f7' : '#101b1c', paper: mode === 'light' ? '#ffffff' : '#172728' },
        },
        shape: { borderRadius: 14 },
        typography: { fontFamily: '"Inter", "Segoe UI", sans-serif', h4: { fontWeight: 800 }, h5: { fontWeight: 750 } },
      }),
    [mode],
  );
  const toggleMode = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem('fitness-theme', next);
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeModeContext);
