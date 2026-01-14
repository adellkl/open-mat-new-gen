// Gestion de l'authentification avec cookies sécurisés

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

// Générer un token simple (dans un vrai projet, utiliser JWT)
const generateToken = (user: AuthUser): string => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    timestamp: Date.now()
  };
  return btoa(JSON.stringify(payload));
};

// Décoder un token
const decodeToken = (token: string): AuthUser | null => {
  try {
    const payload = JSON.parse(atob(token));
    // Vérifier que le token n'est pas expiré (24h)
    const age = Date.now() - payload.timestamp;
    if (age > 24 * 60 * 60 * 1000) {
      return null; // Token expiré
    }
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role
    };
  } catch {
    return null;
  }
};

// Définir un cookie
const setCookie = (name: string, value: string, days: number = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
};

// Récupérer un cookie
const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Supprimer un cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`;
};

export const auth = {
  // Se connecter
  login: (admin: AuthUser) => {
    const token = generateToken(admin);
    setCookie('omf_admin_token', token, 1);
    localStorage.setItem('omf_admin_auth', 'true');
    localStorage.setItem('omf_admin_user', JSON.stringify(admin));
  },

  // Se déconnecter
  logout: () => {
    deleteCookie('omf_admin_token');
    localStorage.removeItem('omf_admin_auth');
    localStorage.removeItem('omf_admin_user');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    const token = getCookie('omf_admin_token');
    const localAuth = localStorage.getItem('omf_admin_auth');
    
    if (!token || localAuth !== 'true') {
      return false;
    }
    
    const user = decodeToken(token);
    if (!user) {
      // Token invalide ou expiré
      auth.logout();
      return false;
    }
    
    return true;
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: (): AuthUser | null => {
    const token = getCookie('omf_admin_token');
    if (!token) return null;
    
    const user = decodeToken(token);
    if (!user) {
      auth.logout();
      return null;
    }
    
    return user;
  },

  // Hasher un mot de passe (simple, dans un vrai projet utiliser bcrypt côté serveur)
  hashPassword: (password: string): string => {
    // Simple hash pour demo - dans un vrai projet, utiliser bcrypt côté serveur
    return btoa(password + 'omf_salt_2024');
  },

  // Vérifier le rôle
  hasRole: (requiredRole: 'admin' | 'moderator' | 'viewer'): boolean => {
    const user = auth.getCurrentUser();
    if (!user) return false;
    
    const roles = ['viewer', 'moderator', 'admin'];
    const userRoleLevel = roles.indexOf(user.role);
    const requiredRoleLevel = roles.indexOf(requiredRole);
    
    return userRoleLevel >= requiredRoleLevel;
  }
};
