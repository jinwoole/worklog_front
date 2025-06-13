import { writable } from 'svelte/store';

/** @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar
 */

/** @type {import('svelte/store').Writable<User | null>} */
export const user = writable(null);

/** @type {import('svelte/store').Writable<boolean>} */
export const isAuthenticated = writable(false);

/** @type {import('svelte/store').Writable<boolean>} */
export const showLoginModal = writable(false);

/**
 * Mock login function - 실제로는 서버와 통신해야 함
 * @param {string} username
 * @param {string} passkey
 */
export async function login(username, passkey) {
	// 임시로 간단한 검증
	if (username && passkey) {
		const mockUser = {
			id: '1',
			name: username,
			email: `${username.toLowerCase()}@worklog.com`,
			avatar: '👤'
		};
		
		user.set(mockUser);
		isAuthenticated.set(true);
		showLoginModal.set(false);
		
		return { success: true };
	}
	
	return { success: false, error: 'Invalid credentials' };
}

/**
 * Logout function
 */
export function logout() {
	user.set(null);
	isAuthenticated.set(false);
}

/**
 * Open login modal
 */
export function openLoginModal() {
	showLoginModal.set(true);
}

/**
 * Close login modal
 */
export function closeLoginModal() {
	showLoginModal.set(false);
}
