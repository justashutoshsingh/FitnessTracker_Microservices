// This row presents one ActivityResponse and links to its recommendation detail page.
import { ChevronRight, FitnessCenter } from '@mui/icons-material';
import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { displayType, formatDate } from '../utils/activity';

export default function ActivityRow({ activity }) {
  return (
    <ListItem secondaryAction={<IconButton component={Link} to={`/activities/${activity.id}`}><ChevronRight /></IconButton>} sx={{ px: 0 }}>
      <ListItemAvatar><Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}><FitnessCenter /></Avatar></ListItemAvatar>
      <ListItemText primary={displayType(activity.type)} secondary={<Box component="span" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}><span>{activity.duration} min</span><span>•</span><span>{activity.caloriesBurned} kcal</span><span>•</span><span>{formatDate(activity.startTime)}</span></Box>} />
      <Typography variant="caption" color="text.secondary" sx={{ mr: 5, display: { xs: 'none', sm: 'block' } }}>{activity.additionalMetrics ? 'Metrics added' : ''}</Typography>
    </ListItem>
  );
}
