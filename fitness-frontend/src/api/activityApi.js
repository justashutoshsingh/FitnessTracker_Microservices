// These functions map the verified Activity Service endpoints without sending the gateway-owned user ID.
import apiClient from './client';

export const getActivities = async () => (await apiClient.get('/api/activities')).data;
export const addActivity = async (activity) => (await apiClient.post('/api/activities/add', activity)).data;
