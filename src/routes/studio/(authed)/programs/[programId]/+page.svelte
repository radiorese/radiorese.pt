<script>
	import { goto } from '$app/navigation';
	let { data } = $props();

	if (!data.userRole) {
		goto('/studio/programs');
	}

	let user = data.user;
	let userRole = data.userRole;
	let program = data.program;

	console.log(program);
	console.log(user);

	import undoIcon from '$lib/icons/undo.svg';
    import forwardIcon from '$lib/icons/forward.svg';
	import editIcon from '$lib/icons/edit.svg';

	function handleRowClick(episodeNumber) {
		goto(`/studio/programs/${program.id}/${episodeNumber}`);
	}
</script>

{#if !userRole}
	<p>Redirecting...</p>
{:else}
	<!--title section-->
	<div class="spaceBetween">
		<div id="titleDiv">
			<button onclick={() => goto('/studio/programs')}
				><img src={undoIcon} alt="Undo" class="iconSize2" /></button
			>
			<h1 class="tSize3">{program.title}</h1>
		</div>
		{#if userRole === 'admin'}
			<button onclick={() => goto(`/studio/programs/edit/${program.id}`)} class="whiteButton">Editar</button>
		{:else if userRole === 'programCurator'}
			<button onclick={() => goto(`/studio/programs/${program.id}/edit`)} class="whiteButton">Editar Título/Sinopse</button>
		{/if}
	</div>

	<!--stakeholders section-->
	<div id="stakeholdersDiv" class="mTop-xl mBottom-xxl">
		<div>
			<h2 class="tSize1 cMain4 mBottom-s">Criado por</h2>
			<p class="tSize2">
				{#each program.creators as creator, index}
					{creator}{index < program.creators.length - 1 ? ', ' : ''}
				{/each}
			</p>
		</div>
		<div>
			<h2 class="tSize1 cMain4 mBottom-s">Curado por</h2>
			<p class="tSize2">
				{#each program.curators as curator, index}
					{curator}{index < program.curators.length - 1 ? ', ' : ''}
				{/each}
			</p>
		</div>
	</div>

    <!--synopsis-->
    <p id="synopsis" class="cMain3">
        {program.synopsis}
    </p>

	<!--episodes section-->
	<div class="spaceBetween mTop-xxxl">
    	<h2 class="tSize2">Episódios <b class="cMain3 tSize2">({program.episodes.length})</b></h2>
		{#if userRole === 'admin' || userRole === 'programCurator'}
			<button onclick={() => goto(`/studio/programs/${program.id}/newEpisode`)} class="whiteButton">Adicionar Episódio</button>
		{/if}
	</div>
	<table class="">
		<thead>
			<tr>
				<th class="cMain4">#</th>
				<th class="cMain4">Título</th>
				<th class="cMain4">Curado por</th>
			</tr>
		</thead>
		<tbody>
			{#each program.episodes as episode}
				{#if userRole === 'admin' || userRole === 'programCurator' || episode.curators.includes(user.name)}
					<tr class="available" onclick={handleRowClick(episode.number)}>
						<td class="cMain5">{episode.number}</td>
						<td>{episode.title}</td>
						<td>
							{#each episode.curators as curator, index}
								{curator}{index < episode.curators.length - 1 ? ', ' : ''}
							{/each}
						</td>
						<td class="iconSize1 fowardIcon">
							<img class="iconSize1" src={forwardIcon} alt="forward">
						</td>
					</tr>
				{:else}
					<tr>
						<td class="cMain5">{episode.number}</td>
						<td>{episode.title}</td>
						<td>
							{#each episode.curators as curator, index}
								{curator}{index < episode.curators.length - 1 ? ', ' : ''}
							{/each}
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
{/if}

<style>
    table {
		width: 100%;
		border-collapse: collapse;

		th,
		td {
			padding: 1.3rem 1rem;
		}

		tr {
			border-bottom: 1px solid var(--main3);
		}

		tbody tr:last-child {
			border-bottom: none;
		}

		.fowardIcon {
			transition: var(--globalTransitionTime);
		}

		tbody .available:hover {
			background-color: var(--offSecondary);
			.fowardIcon {
				rotate: -45deg;
			}
		}

		tbody .available {
			cursor: pointer;
		}
	}

	#titleDiv{
            display: flex;
            justify-content: left;
            gap: 1rem;
            align-items: center;
        }

	

	#stakeholdersDiv{
		display: flex;
		justify-content: left;
		align-items: flex-start;
		gap: 2rem;
	}

	#synopsis{
		max-width: 40ch;
	}
    
</style>
