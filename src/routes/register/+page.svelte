<script lang="ts">
  import { enhance } from '$app/forms'
  import type { ActionData } from './$types'

  export let form: ActionData
</script>

<form method="POST" action="?/register" use:enhance>
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