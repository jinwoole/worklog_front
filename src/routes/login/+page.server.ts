import { fail, redirect } from '@sveltejs/kit'
import { AuthService } from '$lib/server/services/pwd.auth.service'
import type { Actions } from './$types'

const authService = new AuthService()

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get('email') as string
    const password = data.get('password') as string

    // 기본 validation
    if (!email || !password) {
      return fail(400, {
        error: 'Email and password are required',
        email
      })
    }

    try {
      console.log('Login attempt for email:', email)
      
      const { user, sessionId } = await authService.login({ email, password })
      
      console.log('Login successful for user:', user.id)
      
      // 세션 쿠키 설정
      cookies.set('session_id', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7일
        httpOnly: true,
        secure: false, // 개발환경에서는 false, 프로덕션에서는 true
        sameSite: 'lax'
      })

      console.log('Session cookie set, redirecting to home')
      
      // 로그인 성공 시 메인 페이지로 리다이렉트
      throw redirect(302, '/')

    } catch (error) {
      // redirect는 정상적인 흐름이므로 다시 던져줌
      if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
        throw error
      }
      
      console.error('Login error:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
      
      return fail(400, {
        error: error instanceof Error ? error.message : 'Login failed',
        email
      })
    }
  }
}