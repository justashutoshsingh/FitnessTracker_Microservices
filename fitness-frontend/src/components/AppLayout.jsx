// This layout provides responsive navigation and a shared shell for pages backed by the gateway.
import { useState } from 'react';
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AddCircleOutline, Dashboard, FitnessCenter, ListAlt, Logout, Menu, DarkMode, LightMode } from '@mui/icons-material';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useThemeMode } from '../theme/AppThemeProvider';

const drawerWidth = 248;
const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Activities', path: '/activities', icon: <ListAlt /> },
  { label: 'Add Activity', path: '/activities/new', icon: <AddCircleOutline /> },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const location = useLocation();
  const name = user?.given_name || user?.preferred_username || 'Athlete';

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FitnessCenter color="primary" /><Typography variant="h6" fontWeight={800}>Pulse</Typography>
      </Box>
      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => (
          <ListItemButton key={item.path} component={NavLink} to={item.path} selected={location.pathname === item.path || (item.path === '/activities' && location.pathname.startsWith('/activities/'))} onClick={() => setMobileOpen(false)} sx={{ mb: 0.5, borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 42 }}>{item.icon}</ListItemIcon><ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <ListItemButton onClick={logout} sx={{ borderRadius: 2 }}><ListItemIcon sx={{ minWidth: 42 }}><Logout /></ListItemIcon><ListItemText primary="Logout" /></ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ display: { md: 'none' } }}>
        <Toolbar><IconButton onClick={() => setMobileOpen(!mobileOpen)}><Menu /></IconButton><Typography fontWeight={800}>Pulse Fitness</Typography></Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant={isMobile ? 'temporary' : 'permanent'} open={isMobile ? mobileOpen : true} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 0 } }}>{drawer}</Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, px: { xs: 2, md: 5 }, pt: { xs: 8, md: 3 } }}>
          <Typography variant="body2" color="text.secondary">Hi, {name}</Typography>
          <IconButton onClick={toggleMode} aria-label="toggle theme">{mode === 'light' ? <DarkMode /> : <LightMode />}</IconButton>
        </Box>
        <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, pb: 5, pt: { xs: 2, md: 1 } }}><Outlet /></Box>
      </Box>
    </Box>
  );
}
