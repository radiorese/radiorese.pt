<script>
    import { goto } from '$app/navigation';
  
    async function handleLogout() {
      // Call the logout endpoint
      const response = await fetch('/studio/logout', {
        method: 'POST'
      });
  
      if (response.ok) {
        // Redirect to the login page using an absolute path
        goto('/studio/login');
      }
    }
  </script>
  
  <button on:click={handleLogout}>Logout</button>
  
  <slot></slot>