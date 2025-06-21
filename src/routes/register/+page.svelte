<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { fetchCurrentUser } from '$lib/stores/user'
  import type { ActionData } from './$types'

  export let form: ActionData

  // 회원가입 성공 후 사용자 정보 업데이트
  const handleSubmit = () => {
    return async ({ result }) => {
      if (result.type === 'redirect') {
        // 회원가입 성공 시 사용자 정보를 스토어에 업데이트
        await fetchCurrentUser()
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