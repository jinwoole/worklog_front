<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { fetchCurrentUser } from '$lib/stores/user'
  import type { ActionData } from './$types'

  export let form: ActionData

  // 로그인 성공 후 사용자 정보 업데이트
  const handleSubmit = () => {
    return async ({ result }) => {
      if (result.type === 'redirect') {
        // 로그인 성공 시 사용자 정보를 스토어에 업데이트
        await fetchCurrentUser()
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