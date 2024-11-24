<script>
	import { goto } from '$app/navigation';
	import sidebarIcon from '$lib/icons/sidebar.svg';
	import { page } from '$app/stores';

	// Menu toggle
	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
		console.log(menuOpen);
	}
	
	// Get user data
	export let data;
	const { user } = data;

	// Navigation
	const adminNav = [
		{ name:'Horário', path:'/studio/schedule' },
		{ name:'Episódios', path:'/studio/episodes' },
		{ name:'Membros', path:'/studio/members' },
		{ name:'Programas', path:'/studio/programs' }
	];

	const memberNav = [
		{ name:'Perfil', path:'/studio/profile' },
		{ name:'Programas', path:'/studio/programs' }
	];

	const nav = user.isAdmin ? adminNav : memberNav;

	// Logout function
	async function handleLogout() {
		const response = await fetch('/studio/logout', {
			method: 'POST'
		});

		if (response.ok) {
			goto('/studio/login');
		}
	}
</script>

<header>
	<button on:click={toggleMenu} class="sidebarButton">
		<img src={sidebarIcon} alt="sidebar icon" />
		<h3 class="tSize1">RESE Studio</h3>
	</button>
	<h3 class="tSize1">{user.at}</h3>
</header>

<nav class="glassMorphic {menuOpen ? '' : 'closed'}">
	<div class="navLinks">
		{#each nav as item}
			{#if item.path === $page.url.pathname}
				<a href={item.path} class="tSize1">{item.name}</a>
			{:else}
				<a href={item.path} class="tSize1 cMain3">{item.name}</a>
			{/if}
		{/each}
	</div>
	<button class="tSize1" on:click={handleLogout}>Log Out</button>
</nav>

<slot></slot>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: var(--headerHeight);
	}

	img {
		width: 1.5rem;
		height: 1.5rem;
	}

	.sidebarButton {
		display: flex;
		align-items: center;
		gap: 1rem;
		cursor: pointer;
	}

	nav {
		width: 100%;
		height: calc(100svh - var(--headerHeight) - var(--globalMargin));
		max-width: 380px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 2rem;
		border-radius: 2rem;
		border: solid 1px var(--main3);
		position: absolute;
    left: var(--globalMargin);
		transition: 0.3s;
	}

	.closed {
		left: -700px;
	}

	.navLinks {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
