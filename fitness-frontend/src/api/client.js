// This Axios client targets the Spring Cloud Gateway and refreshes the Keycloak bearer token before requests.
import axios from 'axios';
import keycloak from '../auth/keycloak';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (error) {
      console.error('Unable to refresh the access token', error);
      await keycloak.logout({ redirectUri: `${window.location.origin}/login` });
      return Promise.reject(error);
    }
  }
  return config;
});

export default apiClient;
