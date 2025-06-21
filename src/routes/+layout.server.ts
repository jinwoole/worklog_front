import { AuthService } from '$lib/server/services/pwd.auth.service'
import type { LayoutServerLoad } from './$types'

const authService = new AuthService()

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sessionId = cookies.get('session_id')
  
  if (!sessionId) {
    return {
      user: null
    }
  }

  try {
    const user = await authService.getCurrentUser(sessionId)
    return {
      user
    }
  } catch (error) {
    console.error('Failed to get current user:', error)
    return {
      user: null
    }
  }
}
