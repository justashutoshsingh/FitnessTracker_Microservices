// This route guard waits for Keycloak and redirects unauthenticated visitors to the login page.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from './AuthProvider';

export default function ProtectedRoute() {
  const { ready, authenticated } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <Box className="page-loader"><CircularProgress /></Box>;
  }
  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
