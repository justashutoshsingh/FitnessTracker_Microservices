// This landing page starts Keycloak login or registration instead of collecting passwords in React.
import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { FitnessCenter, Login, PersonAddAlt1 } from '@mui/icons-material';
import { useAuth } from '../auth/AuthProvider';

export default function LoginPage() {
  const { ready, authenticated, login, register } = useAuth();
  if (ready && authenticated) window.location.replace('/dashboard');
  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Paper elevation={0} sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center', width: '100%', border: '1px solid', borderColor: 'divider' }}>
        <FitnessCenter color="primary" sx={{ fontSize: 54, mb: 1 }} />
        <Typography variant="h3" sx={{ mb: 1 }}>Pulse</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Train smarter. Feel stronger. Keep your momentum.</Typography>
        <Stack spacing={1.5}>
          <Button variant="contained" size="large" startIcon={<Login />} onClick={login} disabled={!ready}>Login</Button>
          <Button variant="outlined" size="large" startIcon={<PersonAddAlt1 />} onClick={register} disabled={!ready}>New user? Register</Button>
        </Stack>
      </Paper>
    </Container>
  );
}
