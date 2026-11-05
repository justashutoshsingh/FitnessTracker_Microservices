// This page lists ActivityResponses and provides client-side type filtering and date sorting.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { getActivities } from '../api/activityApi';
import ActivityRow from '../components/ActivityRow';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusState';
import { ACTIVITY_TYPES, displayType } from '../utils/activity';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]); const [filter, setFilter] = useState('ALL'); const [ascending, setAscending] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setActivities(await getActivities()); } catch (err) { setError(err.response?.data?.message || 'Could not load your activities.'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const shown = useMemo(() => activities.filter((item) => filter === 'ALL' || item.type === filter).sort((a, b) => (ascending ? 1 : -1) * (new Date(a.startTime) - new Date(b.startTime))), [activities, filter, ascending]);
  return <Stack spacing={3}><Box><Typography variant="h4">Activities</Typography><Typography color="text.secondary">Review every workout you have logged.</Typography></Box><Paper sx={{ p: 2 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><Select size="small" value={filter} onChange={(event) => setFilter(event.target.value)} sx={{ minWidth: 190 }}><MenuItem value="ALL">All activity types</MenuItem>{ACTIVITY_TYPES.map((type) => <MenuItem value={type} key={type}>{displayType(type)}</MenuItem>)}</Select><Select size="small" value={ascending ? 'oldest' : 'newest'} onChange={(event) => setAscending(event.target.value === 'oldest')} sx={{ minWidth: 150 }}><MenuItem value="newest">Newest first</MenuItem><MenuItem value="oldest">Oldest first</MenuItem></Select></Stack></Paper>{error ? <ErrorState message={error} onRetry={load} /> : loading ? <LoadingState /> : <Paper sx={{ p: { xs: 2, sm: 3 } }}>{shown.length ? shown.map((activity) => <ActivityRow key={activity.id} activity={activity} />) : <EmptyState />}</Paper>}</Stack>;
}
