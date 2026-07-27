export function extractErrorMessage(err, fallback = 'Something went wrong') {
  const messages = err?.response?.data?.messages;
  if (messages && Array.isArray(messages)) return messages.join(', ');
  if (err?.response?.data?.error) return err.response.data.error;
  return fallback;
}