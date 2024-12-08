<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import sidebarIcon from '$lib/icons/sidebar.svg';
	import scheduleIcon from '$lib/icons/schedule.svg';
	import episodesIcon from '$lib/icons/episodes.svg';
	import membersIcon from '$lib/icons/members.svg';
	import programsIcon from '$lib/icons/programs.svg';
	import profileIcon from '$lib/icons/profile.svg';

	// Menu toggle
	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	// Get user data
	export let data;
	const { user } = data;

	// Navigation
	const adminNav = [
		{ name: 'Horário', path: '/studio/schedule', icon: scheduleIcon },
		{ name: 'Episódios', path: '/studio/episodes', icon: episodesIcon },
		{ name: 'Membros', path: '/studio/members', icon: membersIcon },
		{ name: 'Programas', path: '/studio/programs', icon: programsIcon }
	];

	const memberNav = [
		/*{ name: 'Perfil', path: '/studio/profile', icon: profileIcon },*/
		{ name: 'Os teus programas', path: '/studio/programs', icon: programsIcon }
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

	// Function to handle keydown event
	function handleKeydown(event) {
		if (event.ctrlKey && event.key >= '1' && event.key <= String(nav.length)) {
			const index = parseInt(event.key) - 1;
			event.preventDefault();
			goto(nav[index].path);
		}

		if (event.ctrlKey && event.key === '\\') {
			toggleMenu();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<header>
	<div>
		<button on:click={toggleMenu}>
			<img src={sidebarIcon} class="iconSize2" alt="ícone da sidebar" />
		</button>
		<h3 class="tSize1">RESE Studio</h3>
	</div>
	<h3 class="tSize1">{user.at}</h3>
</header>

<div id="mainDiv">
	<nav class="glassMorphic {menuOpen ? '' : 'closed'} mRight-xxl bRadius1">
		<div id="navLinks">
			{#each nav as item, index}
				<div class="navLink">
					<div>
						<img src={item.icon} class="iconSize2" alt="ícone de {item.name}" />
						{#if item.path === $page.url.pathname}
							<a href={item.path} class="tSize1">{item.name}</a>
						{:else}
							<a href={item.path} class="tSize1 cMain3">{item.name}</a>
						{/if}
					</div>
					<p class="shortCut cMain5">ctrl + {index + 1}</p>
				</div>
			{/each}
		</div>
		<button class="tSize1" on:click={handleLogout}>Log Out</button>
	</nav>

	<main>
		<slot></slot>
	</main>
</div>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: var(--headerHeight);
		position: sticky;
		top: 0;
		background-color: var(--secondary);
		div {
			display: flex;
			align-items: center;
			gap: 1rem;
			button {
				background: rgba(255, 255, 255, 0);
				transition: 0.3s;
				:hover {
					background-color: var(--main5);
				}
			}
		}
	}
	
	#mainDiv {
		display: flex;
		main{
			width:100%;
		}
	}
	nav {
		width: calc(100% - (var(--globalMargin)) * 2);
		max-width: 340px;
		height: calc(100svh - var(--headerHeight) - var(--globalMargin));
		min-height: fit-content;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 4rem;
		padding: 2rem;
		border: solid 1px var(--main3);
		position: sticky;
		top: var(--headerHeight);
	}

	@media (max-width: 900px) {
		nav {
			max-width: calc(100% - (var(--globalMargin)) * 2);
			height: calc(100svh - var(--headerHeight) - var(--globalMargin));
			position: absolute;
			top: var(--headerHeight);
			left: var(--globalMargin);
			.shortCut {
				display: none;
			}
		}
	}

	.closed {
		position: absolute;
		left: -110%;
	}

	#navLinks {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.navLink {
		display: flex;
		align-items: center;
		justify-content: space-between;
		div {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
	}
</style>
