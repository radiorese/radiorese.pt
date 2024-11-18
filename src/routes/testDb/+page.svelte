<!-- src/routes/test-db/+page.svelte -->
<script>
    export let data;
  </script>
  
  {#if data.dbConnected}
    <h1>Database Connected!</h1>
    <p>Current Database Time: {data.time}</p>
  {:else}
    <h1>Database Connection Failed</h1>
    <p>Error: {data.error}</p>
  {/if}