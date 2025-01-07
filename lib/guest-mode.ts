// lib/guest-mode.ts

const GUEST_QUERY_LIMIT = 5; // Adjust limit as needed
const GUEST_QUERIES_KEY = 'guestQueries';

export const hasGuestQueriesRemaining = (): boolean => {
  if (typeof window === 'undefined') return true;
  const queries = Number(localStorage.getItem(GUEST_QUERIES_KEY) || 0);
  return queries < GUEST_QUERY_LIMIT;
};

export const getRemainingQueries = (): number => {
  if (typeof window === 'undefined') return GUEST_QUERY_LIMIT;
  const queries = Number(localStorage.getItem(GUEST_QUERIES_KEY) || 0);
  return GUEST_QUERY_LIMIT - queries;
};

export const incrementGuestQueries = (): void => {
  if (typeof window === 'undefined') return;
  const queries = Number(localStorage.getItem(GUEST_QUERIES_KEY) || 0);
  localStorage.setItem(GUEST_QUERIES_KEY, String(queries + 1));
};