import { writable } from 'svelte/store';
import type { User } from '$lib/server/types/user';

// 사용자 상태를 관리하는 전역 스토어
export const userStore = writable<User | null>(null);

// 사용자 정보를 업데이트하는 헬퍼 함수
export function updateUser(user: User | null) {
  userStore.set(user);
}

// 로그아웃 처리
export async function logout() {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      userStore.set(null);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}
