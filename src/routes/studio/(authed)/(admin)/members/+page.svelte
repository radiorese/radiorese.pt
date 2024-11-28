<script>
	import addIcon from '$lib/icons/add.svg';
	import editIcon from '$lib/icons/edit.svg';
	import { onMount } from 'svelte';

	export let data;
	let activeMembers = data.activeMembers;
	let inactiveMembers = data.inactiveMembers;
	let numberOfActiveMembers = activeMembers.length;
	let numberOfInactiveMembers = inactiveMembers.length;

	//Add member popup
	import AddMemberPopup from './addMemberPopup.svelte';
	let showAddMemberPopup = false;
	let isActive = true;
	function toggleAddMemberPopup(active) {
		isActive = active;
		showAddMemberPopup = !showAddMemberPopup;
	}

	//Edit member popup
	import EditMemberPopup from './editMemberPopup.svelte';
	let showEditMemberPopup = false;
	let isEditing = false;
	let selectedMember = null;
	function toggleEditMemberPopup(event, member) {
		if (event && member) {
			isEditing = event.target.tagName === 'IMG';
			selectedMember = member;
		}
		showEditMemberPopup = !showEditMemberPopup;
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
	<AddMemberPopup {isActive} on:close={toggleAddMemberPopup} />
{/if}

{#if showEditMemberPopup}
	<EditMemberPopup {isEditing} {selectedMember} on:close={toggleEditMemberPopup} />
{/if}

<div class="blurLayer glassMorphic {showAddMemberPopup || showEditMemberPopup ? '' : 'hidden'}"></div>

<!-- Form feedback -->
{#if form?.error}
	<p class="cRed">Falha 👿 {form.error}</p>
{/if}

{#if form?.success}
	<p class="cGreen">Conseguiste 🫰 {form.success}</p>
{/if}

<!-- Active Members -->
<h1 class="mBottom-m mTop-m">Membros Ativos <b class="cMain4">({numberOfActiveMembers})</b></h1>
<div class="cardsDiv mBottom-xxl">

	<button class="memberCard bRadius3 dashedBorder" on:click={() => toggleAddMemberPopup(true)}>
		<p class="mRight-m tSize1">Adicionar</p>
		<img src={addIcon} alt="adicionar" class="iconSize1" />
	</button>

	{#if activeMembers}
		{#each activeMembers as member}
			<button class="memberCard solidBorder bRadius3" on:click={(event) => toggleEditMemberPopup(event, member)}>
				<p class="mRight-m tSize1">{member.name}</p>
				<p class="mRight-l cMain4 tSize1">@{member.at}</p>
				<img class="iconSize1" src={editIcon} alt="editar" />
			</button>
		{/each}
	{/if}

</div>

<!-- Inactive Members -->
<h1 class="mBottom-m mTop-l">Membros Inativos <b class="cMain4">({numberOfInactiveMembers})</b></h1>
<div class="cardsDiv mBottom-xxl">

	<button class="memberCard bRadius3 dashedBorder" on:click={() => toggleAddMemberPopup(false)}>
		<p class="mRight-m tSize1">Adicionar</p>
		<img src={addIcon} alt="adicionar" class="iconSize1" />
	</button>

	{#if inactiveMembers}
		{#each inactiveMembers as member}
			<button class="memberCard solidBorder bRadius3" on:click={(event) => toggleEditMemberPopup(event, member)}>
				<p class="mRight-m tSize1">{member.name}</p>
				<p class="mRight-l cMain4 tSize1">@{member.at}</p>
				<img class="iconSize1" src={editIcon} alt="editar" />
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

	.memberCard:hover {
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
