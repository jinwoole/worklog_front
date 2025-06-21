<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto, invalidateAll } from '$app/navigation'
  import type { ActionData } from './$types'

  export let form: ActionData

  // 회원가입 성공 후 모든 로드 함수 재실행
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

<form method="POST" action="?/register" use:enhance={handleSubmit}>
  {#if form?.error}
    <p>{form.error}</p>
  {/if}

  <input name="name" type="text" placeholder="Name" required value={form?.name ?? ''} />
  <input name="email" type="email" placeholder="Email" required value={form?.email ?? ''} />
  <input name="password" type="password" placeholder="Password" required />
  <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
  
  <button type="submit">Register</button>
</form>

<a href="/login">Login</a>