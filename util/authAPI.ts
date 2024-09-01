import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
const LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

export async function createUser(email: string, password: string): Promise<string> {
  const response = await axios.post(SIGN_UP_URL, { email, password, returnSecureToken: true });
  const { idToken } = await response.data;
  return idToken;
}

export async function authenticateUser(email: string, password: string): Promise<string> {
  const response = await axios.post(LOGIN_URL, { email, password, returnSecureToken: true });
  const { idToken } = await response.data;
  return idToken;
}
