import { browser } from '$app/environment';

// ================== API Configuration ==================
const API_BASE_URL = 'http://192.168.50.254:8080'; // 백엔드 서버 주소
const API_TIMEOUT = 30000; // 30초 타임아웃
const JWT_STORAGE_KEY = 'worklog_jwt_token';
const REFRESH_TOKEN_KEY = 'worklog_refresh_token';

// ================== JWT Token Management ==================
/**
 * Get stored JWT token
 */
export function getToken() {
	if (!browser) return null;
	return localStorage.getItem(JWT_STORAGE_KEY);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken() {
	if (!browser) return null;
	return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Store JWT tokens securely
 */
export function setTokens(accessToken, refreshToken = null) {
	if (!browser) return;
	localStorage.setItem(JWT_STORAGE_KEY, accessToken);
	if (refreshToken) {
		localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
	}
}

/**
 * Clear all tokens
 */
export function clearTokens() {
	if (!browser) return;
	localStorage.removeItem(JWT_STORAGE_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token) {
	if (!token) return true;
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.exp * 1000 < Date.now();
	} catch {
		return true;
	}
}

// ================== API Client ==================
/**
 * Base fetch wrapper with timeout and error handling
 */
async function fetchWithTimeout(url, options = {}) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
	
	try {
		console.log('Making request to:', url, 'with options:', {
			method: options.method || 'GET',
			headers: options.headers || {},
			hasBody: !!options.body
		});
		
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
			mode: 'cors', // Explicitly set CORS mode
			credentials: 'omit', // Don't send cookies
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...options.headers,
			},
		});
		
		console.log('Response received:', {
			url: response.url,
			status: response.status,
			statusText: response.statusText,
			ok: response.ok,
			headers: Object.fromEntries([...response.headers.entries()])
		});
		
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		console.error('Fetch error:', error);
		if (error.name === 'AbortError') {
			throw new Error('Request timeout');
		}
		throw error;
	}
}

/**
 * Refresh access token
 */
async function refreshAccessToken() {
	const refreshToken = getRefreshToken();
	if (!refreshToken || isTokenExpired(refreshToken)) {
		throw new Error('No valid refresh token');
	}
	
	const response = await fetchWithTimeout(`${API_BASE_URL}/auth/refresh`, {
		method: 'POST',
		body: JSON.stringify({ refreshToken }),
	});
	
	if (!response.ok) {
		throw new Error('Failed to refresh token');
	}
	
	const data = await response.json();
	setTokens(data.accessToken, data.refreshToken);
	return data.accessToken;
}

/**
 * Make authenticated API request
 */
export async function apiRequest(endpoint, options = {}) {
	if (!browser) {
		throw new Error('API calls only available in browser');
	}
	
	const url = `${API_BASE_URL}${endpoint}`;
	let token = getToken();
	
	// Try to refresh token if expired
	if (token && isTokenExpired(token)) {
		try {
			token = await refreshAccessToken();
		} catch {
			clearTokens();
			throw new Error('Authentication expired');
		}
	}
	
	// Add auth header if token exists
	const headers = { ...options.headers };
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	
	const response = await fetchWithTimeout(url, {
		...options,
		headers,
	});
	
	// Handle 401 - try to refresh token once
	if (response.status === 401 && token) {
		try {
			const newToken = await refreshAccessToken();
			headers.Authorization = `Bearer ${newToken}`;
			
			// Retry request with new token
			const retryResponse = await fetchWithTimeout(url, {
				...options,
				headers,
			});
			
			if (!retryResponse.ok) {
				let errorData = {};
				try {
					errorData = await retryResponse.json();
				} catch (e) {
					// Ignore JSON parse errors for retry response
				}
				throw new Error(errorData.message || `API Error: ${retryResponse.status}`);
			}
			
			const retryJsonResponse = await retryResponse.json();
			console.log('API Retry Response:', {
				url: retryResponse.url,
				status: retryResponse.status,
				data: retryJsonResponse
			});
			return retryJsonResponse;
		} catch (error) {
			clearTokens();
			throw new Error('Authentication failed');
		}
	}
	
	if (!response.ok) {
		let errorData = {};
		try {
			errorData = await response.json();
		} catch (e) {
			// If can't parse JSON, use empty object
			console.warn('Could not parse error response as JSON');
		}
		console.error('API Error:', {
			status: response.status,
			statusText: response.statusText,
			url: response.url,
			errorData
		});
		throw new Error(errorData.message || `API Error: ${response.status}`);
	}

	// Try to parse JSON response
	let jsonResponse;
	try {
		// Check if response has content
		const contentLength = response.headers.get('content-length');
		const contentType = response.headers.get('content-type');
		
		if (contentLength === '0' || (!contentType || !contentType.includes('application/json'))) {
			console.log('Empty or non-JSON response, returning empty object');
			return {};
		}
		
		// Clone response to check if it's empty
		const responseClone = response.clone();
		const text = await responseClone.text();
		
		if (!text || text.trim() === '') {
			console.log('Empty response body, returning empty object');
			return {};
		}
		
		jsonResponse = await response.json();
	} catch (error) {
		console.error('Failed to parse JSON response:', error);
		console.log('Response details:', {
			status: response.status,
			statusText: response.statusText,
			headers: Object.fromEntries([...response.headers.entries()])
		});
		throw new Error('Invalid JSON response from server');
	}
	
	console.log('API Response:', {
		url: response.url,
		status: response.status,
		data: jsonResponse
	});
	return jsonResponse;
}

// ================== Auth API Endpoints ==================
/**
 * Begin passkey registration
 */
export async function beginPasskeyRegistration(username) {
	return await apiRequest('/auth/passkey/register/begin', {
		method: 'POST',
		body: JSON.stringify({ username }),
	});
}

/**
 * Finish passkey registration
 */
export async function finishPasskeyRegistration(username, credentialData, sessionKey) {
	const requestBody = {
		username,
		credential: credentialData,
	};
	
	console.log('Finish registration request:', {
		username,
		sessionKey,
		credentialData,
		requestBodySize: JSON.stringify(requestBody).length
	});
	
	return await apiRequest('/auth/passkey/register/finish', {
		method: 'POST',
		headers: {
			'X-Session-Key': sessionKey,
		},
		body: JSON.stringify(requestBody),
	});
}

/**
 * Begin passkey login
 */
export async function beginPasskeyLogin(username) {
	return await apiRequest('/auth/passkey/login/begin', {
		method: 'POST',
		body: JSON.stringify({ username }),
	});
}

/**
 * Finish passkey login
 */
export async function finishPasskeyLogin(username, assertionData, sessionKey) {
	const requestBody = {
		username,
		assertion: assertionData,
	};

	console.log('Finish login request details:', {
		username,
		sessionKey,
		assertion: {
			id: assertionData.id,
			rawId: assertionData.rawId,
			type: assertionData.type,
			response: {
				authenticatorData: assertionData.response.authenticatorData.substring(0, 50) + '...',
				clientDataJSON: assertionData.response.clientDataJSON.substring(0, 50) + '...',
				signature: assertionData.response.signature.substring(0, 50) + '...',
				userHandle: assertionData.response.userHandle
			}
		},
		requestBodySize: JSON.stringify(requestBody).length
	});
	
	return await apiRequest('/auth/passkey/login/finish', {
		method: 'POST',
		headers: {
			'X-Session-Key': sessionKey,
		},
		body: JSON.stringify(requestBody),
	});
}

/**
 * Get user profile
 */
export async function getUserProfile() {
	return await apiRequest('/user/profile');
}

/**
 * Logout (invalidate tokens)
 */
export async function logoutAPI() {
	const refreshToken = getRefreshToken();
	if (refreshToken) {
		try {
			await apiRequest('/auth/logout', {
				method: 'POST',
				body: JSON.stringify({ refreshToken }),
			});
		} catch {
			// Ignore logout API errors
		}
	}
	clearTokens();
}
