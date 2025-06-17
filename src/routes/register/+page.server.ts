import { fail, redirect } from '@sveltejs/kit'
import { AuthService } from '$lib/server/services/pwd.auth.service'
import type { Actions } from './$types'

const authService = new AuthService()

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    const data = await request.formData()
    const name = data.get('name') as string
    const email = data.get('email') as string
    const password = data.get('password') as string
    const confirmPassword = data.get('confirmPassword') as string

    // 기본 validation
    if (!name || !email || !password || !confirmPassword) {
      return fail(400, {
        error: 'All fields are required',
        name,
        email
      })
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Passwords do not match',
        name,
        email
      })
    }

    if (password.length < 6) {
      return fail(400, {
        error: 'Password must be at least 6 characters long',
        name,
        email
      })
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return fail(400, {
        error: 'Please enter a valid email address',
        name,
        email
      })
    }

    try {
      console.log('Register attempt for:', { name, email })
      
      const { user, sessionId } = await authService.register({ name, email, password })
      
      console.log('Registration successful for user:', user.id)
      
      // 세션 쿠키 설정
      cookies.set('session_id', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7일
        httpOnly: true,
        secure: false, // 개발환경에서는 false, 프로덕션에서는 true
        sameSite: 'lax'
      })

      console.log('Session cookie set, redirecting to home')
      
      // 회원가입 성공 시 메인 페이지로 리다이렉트
      throw redirect(302, '/')

    } catch (error) {
      // redirect는 정상적인 흐름이므로 다시 던져줌
      if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
        throw error
      }
      
      console.error('Registration error:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
      
      return fail(400, {
        error: error instanceof Error ? error.message : 'Registration failed',
        name,
        email
      })
    }
  }
}
