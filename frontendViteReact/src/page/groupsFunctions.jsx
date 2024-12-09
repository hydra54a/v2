
export const getCsrfToken = async () => {
  try {
    const response = await fetch('http://localhost:5001/csrf-token', {
      credentials: 'include',
    });
    const data = await response.json();
    return { csrfVal: data.csrfToken, valid: true };
  } catch (error) {
    return { csrfVal: 'Failed to fetch CSRF token', valid: false };
  }
};