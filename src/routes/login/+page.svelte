<script lang="ts">
  import { enhance } from '$app/forms'
  import type { ActionData } from './$types'

  export let form: ActionData
</script>

<form method="POST" action="?/login" use:enhance>
  {#if form?.error}
    <p>{form.error}</p>
  {/if}

  <input name="email" type="email" placeholder="Email" required value={form?.email ?? ''} />
  <input name="password" type="password" placeholder="Password" required />
  
  <button type="submit">Login</button>
</form>

<a href="/register">Register</a>