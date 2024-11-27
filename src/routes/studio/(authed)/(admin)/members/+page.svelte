<script>
	import addIcon from '$lib/icons/add.svg';
	import { onMount } from 'svelte';

	//fetch data
	export let data;
	console.log(data);
	let activeMembers = data.activeMembers;
	let inactiveMembers = data.inactiveMembers;
	let numberOfActiveMembers = activeMembers.length;
	let numberOfInactiveMembers = inactiveMembers.length;

	//Add member popup
	import AddMemberPopup from './addMemberPopup.svelte';
	let showAddMemberPopup = false;
	function toggleMemberPopup() {
		showAddMemberPopup = !showAddMemberPopup;
	}
	export let form;

	//Download credentials
	onMount(() => {
		if (form?.credentialText) {
			const blob = new Blob([form.credentialText], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = form.fileName || 'credentials.txt';
			a.click();
			URL.revokeObjectURL(url);
		}
	});
</script>

<!-- Forms -->
{#if showAddMemberPopup}
	<AddMemberPopup on:close={toggleMemberPopup} />
{/if}
<div class="blurLayer glassMorphic {showAddMemberPopup ? '' : 'hidden'}"></div>

<!-- Form feedback -->
{#if form?.error}
	<p class="cRed">Erro: {form.error}</p>
{/if}

{#if form?.success}
	<p class="cGreen">Sucesso: {form.success}</p>
{/if}

<!-- Active Members -->
<h1 class="mBottom-m mTop-m">Membros Ativos <b class="cMain4">({numberOfActiveMembers})</b></h1>
<div class="cardsDiv mBottom-xxl">
	<button class="memberCard bRadius3 dashedBorder" on:click={toggleMemberPopup}>
		<p class="mRight-m tSize1">Adicionar</p>
		<img src={addIcon} alt="adicionar" class="iconSize1" />
	</button>
	{#if activeMembers}
		{#each activeMembers as member}
			<button class="memberCard solidBorder bRadius3">
				<p class="mRight-m tSize1">{member.name}</p>
				<p class="cMain4 tSize1">@{member.at}</p>
			</button>
		{/each}
	{/if}
</div>

<!-- Inactive Members -->
<h1 class="mBottom-m mTop-l">Membros Inativos <b class="cMain4">({numberOfInactiveMembers})</b></h1>
<div class="cardsDiv mBottom-xxl">
	<button class="memberCard bRadius3 dashedBorder" on:click={toggleMemberPopup}>
		<p class="mRight-m tSize1">Adicionar</p>
		<img src={addIcon} alt="adicionar" class="iconSize1" />
	</button>
	{#if inactiveMembers}
		{#each inactiveMembers as member}
			<button class="memberCard solidBorder bRadius3">
				<p class="mRight-m tSize1">{member.name}</p>
				<p class="cMain4 tSize1">@{member.at}</p>
			</button>
		{/each}
	{/if}
</div>

<style>
	.memberCard {
		display: flex;
		height: 3.5rem;
		padding-left: 2rem;
		padding-right: 2rem;
		
		background-color: var(--secondary);
		align-items: center;
	}

	.memberCard:nth-child(1):hover {
		background-color: var(--offSecondary);
	}

	.cardsDiv {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.blurLayer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		backdrop-filter: blur(12px);
		opacity: 1;
		transition: 0.3s;
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}
</style>
