// This provider initializes Keycloak, refreshes tokens, and exposes the authenticated user to the app.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import keycloak from './keycloak';

const AuthContext = createContext(null);

// FIX: init ab module level pe hai, component ke andar nahi.
// StrictMode effect ko 2 baar chalata hai, par ye promise sirf ek baar banta hai,
// to keycloak.init() bhi sirf ek baar call hota hai. Dono baar wahi promise milta hai.
let initPromise = null;
function initKeycloak() {
  if (!initPromise) {
    initPromise = keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });
  }
  return initPromise;
}

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    initKeycloak()
      .then((isAuthenticated) => {
        if (!active) return;
        setAuthenticated(isAuthenticated);
        setUser(keycloak.tokenParsed || null);
        setReady(true);
      })
      .catch((error) => {
        console.error('Keycloak initialization failed', error);
        if (active) setReady(true);
      });

    keycloak.onAuthSuccess = () => {
      setAuthenticated(true);
      setUser(keycloak.tokenParsed || null);
    };
    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setUser(null);
    };

    return () => {
      active = false;
      // FIX: cleanup mein handlers hata do, taaki unmounted component pe setState na ho
      keycloak.onAuthSuccess = null;
      keycloak.onAuthLogout = null;
    };
  }, []);

  const login = useCallback(() => keycloak.login({ redirectUri: `${window.location.origin}/dashboard` }), []);
  const register = useCallback(
    () => keycloak.register({ redirectUri: `${window.location.origin}/dashboard` }),
    [],
  );
  const logout = useCallback(() => keycloak.logout({ redirectUri: `${window.location.origin}/login` }), []);
  const refreshToken = useCallback(() => keycloak.updateToken(30), []);

  const value = useMemo(
    () => ({ ready, authenticated, user, token: keycloak.token, login, register, logout, refreshToken }),
    [ready, authenticated, user, login, register, logout, refreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}