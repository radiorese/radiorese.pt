<script>
    import { enhance } from '$app/forms';
    export let form;
  
    let at = form?.at || '';
    let password = form?.password || '';
  </script>
  
  <form method="post" use:enhance>
    <input type="text" name="at" placeholder="@" bind:value={at} />
    <input type="password" name="password" placeholder="Password" bind:value={password} />
    <button type="submit">Login</button>
  </form>
  {#if form?.message}
  {#if form.success === false}
    <p style="color: red;">{form.message}</p>
  {:else}
    <p style="color: green;">{form.message}</p>
  {/if}
{/if}
