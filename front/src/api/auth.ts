const jsonwebtoken = require("jsonwebtoken");

const LOCAL_TOKEN_KEY = "jwt";
const LOCAL_USERNAME_KEY = "username";

const setToken = (token: string) => {
  const decoded = jsonwebtoken.decode(token);
  localStorage.setItem(LOCAL_TOKEN_KEY, token);
  localStorage.setItem(LOCAL_USERNAME_KEY, decoded.username);
};

const clearToken = () => {
  localStorage.removeItem(LOCAL_TOKEN_KEY);
  localStorage.removeItem(LOCAL_USERNAME_KEY);
};

const getToken = () => localStorage.getItem(LOCAL_TOKEN_KEY);

const getUsername = () => localStorage.getItem(LOCAL_USERNAME_KEY);

const isAuthenticated = () => {
  const jwt = localStorage.getItem(LOCAL_TOKEN_KEY);
  if (jwt == null) {
    return false;
  }
  const decoded = jsonwebtoken.decode(jwt);
  if (decoded == null) {
    return false;
  }
  return Date.now() < decoded.exp * 1000;
};

export { setToken, clearToken, getToken, getUsername, isAuthenticated };
