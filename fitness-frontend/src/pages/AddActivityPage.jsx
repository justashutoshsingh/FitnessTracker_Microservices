// This form sends exactly ActivityRequest fields to the gateway and leaves user ownership to the gateway filter.
import { useState } from 'react';
import { Alert, Box, Button, MenuItem, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { addActivity } from '../api/activityApi';
import { ACTIVITY_TYPES, displayType, toLocalInputValue } from '../utils/activity';

const initial = { type: '', duration: '', caloriesBurned: '', startTime: toLocalInputValue(), additionalMetrics: '' };

export default function AddActivityPage() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);
  const navigate = useNavigate();
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (!form.type || !form.duration || !form.caloriesBurned || !form.startTime) { setError('Type, duration, calories, and start time are required.'); return; }
    let metrics;
    if (form.additionalMetrics.trim()) { try { metrics = JSON.parse(form.additionalMetrics); } catch { setError('Additional metrics must be valid JSON, for example: {"pace":"6:00/km"}'); return; } }
    setSaving(true);
    try { await addActivity({ type: form.type, duration: Number(form.duration), caloriesBurned: Number(form.caloriesBurned), startTime: form.startTime, ...(metrics ? { additionalMetrics: metrics } : {}) }); setToast(true); setTimeout(() => navigate('/activities'), 700); } catch (err) { setError(err.response?.data?.message || 'Could not save the activity.'); } finally { setSaving(false); }
  };
  return <Box maxWidth="760px"><Typography variant="h4">Add activity</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Log a workout while it is still fresh.</Typography><Paper component="form" onSubmit={submit} sx={{ p: { xs: 2, sm: 4 } }}><Stack spacing={2.5}>{error && <Alert severity="error">{error}</Alert>}<TextField select label="Activity type" value={form.type} onChange={update('type')} required><MenuItem value="">Select a type</MenuItem>{ACTIVITY_TYPES.map((type) => <MenuItem value={type} key={type}>{displayType(type)}</MenuItem>)}</TextField><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField fullWidth label="Duration (minutes)" type="number" inputProps={{ min: 1 }} value={form.duration} onChange={update('duration')} required /><TextField fullWidth label="Calories burned" type="number" inputProps={{ min: 0 }} value={form.caloriesBurned} onChange={update('caloriesBurned')} required /></Stack><TextField label="Start time" type="datetime-local" value={form.startTime} onChange={update('startTime')} InputLabelProps={{ shrink: true }} required /><TextField label="Additional metrics (optional JSON)" placeholder='{"pace":"6:00/km"}' value={form.additionalMetrics} onChange={update('additionalMetrics')} multiline minRows={3} helperText="Use a JSON object if your workout has extra metrics." /><Button type="submit" variant="contained" size="large" startIcon={<Save />} disabled={saving}>{saving ? 'Saving...' : 'Save activity'}</Button></Stack></Paper><Snackbar open={toast} autoHideDuration={2000} message="Activity saved successfully." /></Box>;
}
