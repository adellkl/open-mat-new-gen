import { OpenMatSession } from '../types';

/**
 * Parse les dates multiples depuis une chaîne
 */
export const parseDates = (value?: string | null | any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value.split('|').map((date) => date.trim()).filter(Boolean);
  }
  return [String(value).trim()].filter(Boolean);
};

/**
 * Vérifie si une session est récurrente
 */
export const isRecurring = (session: OpenMatSession): boolean => {
  if (!session.date || typeof session.date !== 'string') return false;
  return session.date === 'RÉCURRENT' || session.date === '2099-12-31' || session.date.includes('RÉCURRENT');
};

/**
 * Extrait le jour de récurrence depuis le titre ou la description
 */
export const getRecurrenceDay = (session: OpenMatSession): string | null => {
  const text = `${session.title} ${session.description}`.toLowerCase();
  
  if (text.includes('lundi')) return 'lundi';
  if (text.includes('mardi')) return 'mardi';
  if (text.includes('mercredi')) return 'mercredi';
  if (text.includes('jeudi')) return 'jeudi';
  if (text.includes('vendredi')) return 'vendredi';
  if (text.includes('samedi')) return 'samedi';
  if (text.includes('dimanche')) return 'dimanche';
  
  return null;
};

/**
 * Vérifie si une session est expirée
 */
export const isSessionExpired = (session: OpenMatSession): boolean => {
  // Les sessions récurrentes ne sont jamais expirées
  if (isRecurring(session)) return false;
  
  const dates = parseDates(session.date);
  if (dates.length === 0) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Vérifier si toutes les dates sont passées
  const allExpired = dates.every(dateStr => {
    const sessionDate = new Date(dateStr);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate < today;
  });
  
  return allExpired;
};

/**
 * Filtre les sessions actives (non expirées)
 */
export const filterActiveSessions = (sessions: OpenMatSession[]): OpenMatSession[] => {
  return sessions.filter(session => !isSessionExpired(session));
};

/**
 * Filtre les sessions expirées
 */
export const filterExpiredSessions = (sessions: OpenMatSession[]): OpenMatSession[] => {
  return sessions.filter(session => isSessionExpired(session));
};
