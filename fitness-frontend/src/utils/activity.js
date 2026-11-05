// These helpers format backend activity values consistently across dashboard, list, and detail views.
export const ACTIVITY_TYPES = ['RUNNING', 'WALKING', 'CYCLING', 'SWIMMING', 'WEIGHT_TRAINING', 'YOGA', 'HIIT', 'CARDIO', 'STRETCHING', 'OTHER'];
export const displayType = (type = '') => type.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
export const formatDate = (value) => (value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
export const formatDateTime = (value) => (value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—');
export const toLocalInputValue = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};
