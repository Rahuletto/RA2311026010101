export function isInvalidAuthApiError(message: string): boolean {
  const s = message.toLowerCase();
  if (!s.includes('401')) return false;
  return (
    s.includes('invalid authorization') ||
    s.includes('invalid token') ||
    s.includes('unauthorized')
  );
}
