import { json } from '@sveltejs/kit'
import { AuthService } from '$lib/server/services/pwd.auth.service'
import type { RequestHandler } from './$types'

const authService = new AuthService()

export const POST: RequestHandler = async ({ cookies }) => {
  const sessionId = cookies.get('session_id')
  
  if (sessionId) {
    try {
      await authService.logout(sessionId)
    } catch (error) {
      console.error('Logout error:', error)
      // 로그아웃 실패해도 쿠키는 삭제
    }
  }
  
  // 세션 쿠키 삭제
  cookies.delete('session_id', { path: '/' })
  
  return json({ success: true })
}
