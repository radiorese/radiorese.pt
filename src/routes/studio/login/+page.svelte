<script>
	import { enhance } from '$app/forms';
	export let form;

	let at = form?.at || '';
	let password = form?.password || '';

	import logo from '$lib/assets/logo.png';
</script>

<main>
	<div id="titleDiv">
		<img src={logo} alt="Logo" class="iconSize3 rotating" /> <h3 class="tSize3">Studio</h3>
	</div>

	<form method="post">
		<input class="solidBorder bRadius1" type="text" name="at" placeholder="@" bind:value={at} />
		<input
			class="solidBorder bRadius1"
			type="password"
			name="password"
			placeholder="Password"
			bind:value={password}
		/>
		<button type="submit" class="mTop-xl">Login</button>
	</form>
	{#if form?.message}
		{#if form.success === false}
			<p style="color: red;">{form.message}</p>
		{:else}
			<p style="color: green;">{form.message}</p>
		{/if}
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: calc(100svh - var(--globalMargin));
		gap: 2rem;

		> #titleDiv {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
		form{
			display: flex;
			flex-direction: column;
			gap:1rem;
			max-width: 300px;
			width: 100%;
			input{
				width: 100%;
			}
		}

		button{
			text-align: center;
			font-size: 1rem;
			text-decoration: underline;
		}
	}

	.rotating {
		animation: rotate 5s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}
</style>
