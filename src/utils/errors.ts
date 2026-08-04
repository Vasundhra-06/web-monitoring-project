/**
 * Safely extracts a user-readable error message from an API error response.
 * Handles FastAPI validation error lists, simple detail strings, and generic exceptions.
 */
export const getErrorMessage = (err: any, fallback: string): string => {
  if (!err.response) {
    return 'Network error: Unable to reach the server. Please check your connection.';
  }
  
  const detail = err.response.data?.detail;
  if (!detail) return fallback;
  
  if (typeof detail === 'string') {
    return detail;
  }
  
  if (Array.isArray(detail)) {
    // Format FastAPI validation errors (e.g. [{ msg: 'field required', loc: [...] }])
    return detail
      .map((d: any) => {
        if (d.loc && d.loc.length > 1) {
          const field = d.loc[d.loc.length - 1];
          return `${field}: ${d.msg}`;
        }
        return d.msg;
      })
      .join(', ');
  }
  
  if (typeof detail === 'object') {
    if (detail.message) return detail.message;
    return JSON.stringify(detail);
  }
  
  return fallback;
};
