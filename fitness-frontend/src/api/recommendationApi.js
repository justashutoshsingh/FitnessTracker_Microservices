// This function loads the asynchronous Gemini recommendation for one saved activity.
import apiClient from './client';

export const getActivityRecommendation = async (activityId) =>
  (await apiClient.get(`/api/recommendations/activity/${encodeURIComponent(activityId)}`)).data;
