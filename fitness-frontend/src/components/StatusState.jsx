// These small states keep loading, empty, and API failure feedback consistent throughout the app.
import { Alert, Box, Button, CircularProgress, Skeleton, Typography } from '@mui/material';

export function LoadingState({ rows = 3 }) {
  return <Box>{Array.from({ length: rows }, (_, index) => <Skeleton key={index} variant="rounded" height={70} sx={{ mb: 1.5 }} />)}</Box>;
}
export function EmptyState({ message = 'No activities yet, add your first one.' }) {
  return <Box sx={{ py: 7, textAlign: 'center' }}><Typography color="text.secondary">{message}</Typography></Box>;
}
export function ErrorState({ message = 'Something went wrong while loading this data.', onRetry }) {
  return <Alert severity="error" action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Retry</Button> : undefined}>{message}</Alert>;
}
export function PageLoader() {
  return <Box className="page-loader"><CircularProgress /></Box>;
}
