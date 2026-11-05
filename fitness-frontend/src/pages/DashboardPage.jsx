// This dashboard aggregates the authenticated user's ActivityResponses and visualizes recent progress.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, List, Paper, Stack, Typography } from '@mui/material';
import { Add, AccessTime, CalendarMonth, LocalFireDepartment, FitnessCenter } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getActivities } from '../api/activityApi';
import ActivityRow from '../components/ActivityRow';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusState';
import { formatDate } from '../utils/activity';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function DashboardPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setActivities(await getActivities()); } catch (err) { setError(err.response?.data?.message || 'Could not load your activities.'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const recent = useMemo(() => [...activities].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)), [activities]);
  const stats = useMemo(() => {
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0, 0, 0, 0);
    return { count: activities.length, duration: activities.reduce((sum, item) => sum + (item.duration || 0), 0), calories: activities.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0), week: activities.filter((item) => new Date(item.startTime) >= weekStart).length };
  }, [activities]);
  const chartData = recent.slice(0, 7).reverse().map((item) => ({ date: formatDate(item.startTime).split(',')[0], calories: item.caloriesBurned || 0 }));
  const cards = [{ label: 'Total activities', value: stats.count, icon: <FitnessCenter />, color: 'primary.main' }, { label: 'Total duration', value: `${stats.duration} min`, icon: <AccessTime />, color: 'secondary.main' }, { label: 'Calories burned', value: `${stats.calories} kcal`, icon: <LocalFireDepartment />, color: '#df6250' }, { label: 'This week', value: stats.week, icon: <CalendarMonth />, color: '#6b5dd3' }];

  return <Stack spacing={4}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}><Box><Typography variant="h4">Your progress</Typography><Typography color="text.secondary">A clear view of the work you are putting in.</Typography></Box><Button component={Link} to="/activities/new" variant="contained" startIcon={<Add />}>Add Activity</Button></Stack>
    {error && <ErrorState message={error} onRetry={load} />}
    {loading ? <LoadingState rows={4} /> : <><Grid container spacing={2}>{cards.map((card) => <Grid item xs={12} sm={6} lg={3} key={card.label}><Card><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography variant="body2" color="text.secondary">{card.label}</Typography><Typography variant="h5" sx={{ mt: 1 }}>{card.value}</Typography></Box><Box sx={{ color: card.color }}>{card.icon}</Box></CardContent></Card></Grid>)}</Grid>
      <Grid container spacing={3}><Grid item xs={12} md={7}><Paper sx={{ p: 3, height: '100%' }}><Typography variant="h6" sx={{ mb: 2 }}>Recent calories</Typography>{chartData.length ? <ResponsiveContainer width="100%" height={260}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="calories" fill="#167c80" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer> : <EmptyState />}</Paper></Grid><Grid item xs={12} md={5}><Paper sx={{ p: 3, height: '100%' }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6">Recent activities</Typography><Button component={Link} to="/activities" size="small">View all</Button></Stack>{recent.length ? <List>{recent.slice(0, 5).map((activity) => <ActivityRow key={activity.id} activity={activity} />)}</List> : <EmptyState />}</Paper></Grid></Grid>
    </>}
  </Stack>;
}
