import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
const LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
const REFRESH_TOKEN_URL = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;

interface AuthResponse {
  idToken: string;
  localId: string;
  expiresIn: string;
  refreshToken: string;
}

export async function createUser(email: string, password: string): Promise<AuthResponse> {
  const response = await axios.post(SIGN_UP_URL, { email, password, returnSecureToken: true });
  const { idToken, localId, expiresIn, refreshToken } = response.data;
  return { idToken, localId, expiresIn, refreshToken };
}

export async function authenticateUser(email: string, password: string): Promise<AuthResponse> {
  const response = await axios.post(LOGIN_URL, { email, password, returnSecureToken: true });
  const { idToken, localId, expiresIn, refreshToken } = response.data;
  return { idToken, localId, expiresIn, refreshToken };
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await axios.post(REFRESH_TOKEN_URL, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const { id_token: idToken, user_id: localId, expires_in: expiresIn } = response.data;
  return { idToken, localId, expiresIn, refreshToken };
}
