import { createContext, useContext, useState } from 'react';
import { api, storage } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.token ? storage.user : null);

  async function finish(path, body) {
    const { token, user: u } = await api(path, { method: 'POST', body });
    storage.save(token, u);
    setUser(u);
  }

  const value = {
    user,
    login: (email, password) => finish('/auth/login', { email, password }),
    register: (name, email, password) => finish('/auth/register', { name, email, password }),
    logout: () => {
      storage.clear();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
