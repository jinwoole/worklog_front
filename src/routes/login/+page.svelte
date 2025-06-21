<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto, invalidateAll } from '$app/navigation'
  import type { ActionData } from './$types'

  export let form: ActionData

  // 로그인 성공 후 모든 로드 함수 재실행
  const handleSubmit = () => {
    return async ({ result }) => {
      if (result.type === 'redirect') {
        // 모든 로드 함수를 다시 실행하여 사용자 정보 업데이트
        await invalidateAll()
        goto(result.location || '/')
      }
    }
  }
</script>

<form method="POST" action="?/login" use:enhance={handleSubmit}>
  {#if form?.error}
    <p>{form.error}</p>
  {/if}

  <input name="email" type="email" placeholder="Email" required value={form?.email ?? ''} />
  <input name="password" type="password" placeholder="Password" required />
  
  <button type="submit">Login</button>
</form>

<a href="/register">Register</a>