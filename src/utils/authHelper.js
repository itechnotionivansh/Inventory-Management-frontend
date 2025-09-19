export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const getUsername = () =>
  localStorage.getItem("username") || localStorage.getItem("email");

export const setAuth = (token, role, username, email) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  if (username) localStorage.setItem("username", username);
  if (email) localStorage.setItem("email", email);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
};
