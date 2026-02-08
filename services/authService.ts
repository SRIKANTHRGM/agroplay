// Authentication Service - JWT based auth with backend server
import { migrateToUserStorage, clearAllAppData } from './storageService';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE}/api/auth`;

// Token storage keys
const ACCESS_TOKEN_KEY = 'km_access_token';
const REFRESH_TOKEN_KEY = 'km_refresh_token';

/**
 * Store tokens in localStorage
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Clear all tokens and user data from localStorage
 */
export const clearTokens = (): void => {
    // Clear all app data including user-specific storage
    clearAllAppData();
};

/**
 * Decode JWT payload without validation
 */
export const decodeToken = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
};

/**
 * Check if user is authenticated (has valid access token)
 */
export const isAuthenticated = (): boolean => {
    const token = getAccessToken();
    if (!token) return false;
    return !isTokenExpired(token);
};

/**
 * API request with automatic token attachment
 */
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    const token = getAccessToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    // Handle token expiration
    if (response.status === 401 && data.expired) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            // Retry the request with new token
            const newToken = getAccessToken();
            (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
            const retryResponse = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
            });
            return retryResponse.json();
        }
    }

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
};

/**
 * Register new user
 */
export const register = async (name: string, email: string, password: string): Promise<any> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    // Clear any previous user data first
    clearAllAppData();

    // Store tokens
    setTokens(data.accessToken, data.refreshToken);

    // Store user profile for compatibility
    localStorage.setItem('km_user_profile', JSON.stringify(data.user));
    localStorage.setItem('km_auth', 'true');

    return data;
};

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<any> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    // Clear any previous user data first
    clearAllAppData();

    // Store tokens
    setTokens(data.accessToken, data.refreshToken);

    // Store user profile for compatibility
    localStorage.setItem('km_user_profile', JSON.stringify(data.user));
    localStorage.setItem('km_auth', 'true');

    return data;
};

import { auth, googleProvider, signInWithPopup } from './firebase';

/**
 * Real Google OAuth login using Firebase and secure backend verification
 */
export const googleLogin = async (): Promise<any> => {
    try {
        // 1. Authenticate with Google on the frontend
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // 2. Get the ID token from Firebase
        const idToken = await user.getIdToken();

        // 3. Send ID token to our backend for verification and session creation
        const response = await fetch(`${API_URL}/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = data.message || 'Secure Google verification failed';
            if (data.error) errorMessage += `: ${data.error}`;
            if (data.debug) errorMessage += ` (debug: ${JSON.stringify(data.debug)})`;
            throw new Error(errorMessage);
        }

        // Clear any previous user data
        clearAllAppData();

        // Store secure tokens
        setTokens(data.accessToken, data.refreshToken);

        // Store user profile
        localStorage.setItem('km_user_profile', JSON.stringify(data.user));
        localStorage.setItem('km_auth', 'true');

        return data;
    } catch (error: any) {
        console.error("Google Auth error:", error);
        throw new Error(error.message || 'Google authentication failed');
    }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            clearTokens();
            return false;
        }

        setTokens(data.accessToken, data.refreshToken);
        return true;
    } catch {
        clearTokens();
        return false;
    }
};

/**
 * Get current user from server
 */
export const getCurrentUser = async (): Promise<any> => {
    return apiRequest('/me');
};

/**
 * Update user profile
 */
export const updateProfile = async (updates: Record<string, any>): Promise<any> => {
    return apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();

    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
    } catch {
        // Ignore logout errors
    }

    clearTokens();
};
