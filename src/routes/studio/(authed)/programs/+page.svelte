<script>
	import { goto } from '$app/navigation';
	export let data;
	let programs = data.programs;
	let userIsAdmin = data.userIsAdmin;

	import musicIcon from '$lib/icons/music.svg';
	import podcastIcon from '$lib/icons/podcast.svg';

	import forwardIcon from '$lib/icons/forward.svg';

	function handleRowClick(programId) {
		goto(`/studio/programs/${programId}`);
	}
</script>

{#if userIsAdmin}
	<div id="titleDiv">
		<h1 class="tSize3">Programas <b class="cMain3 tSize3">({programs.length})</b></h1>
		<a href="/studio/programs/newProgram">
			<button class="cSecondary tSize2 whiteButton"> Novo Programa </button>
		</a>
	</div>
{:else}
	<h1 class="mTop-m tSize3">Os teus programas <b class="cMain3 tSize3">({programs.length})</b></h1>
{/if}

<table class="mTop-xl">
	<thead>
		<tr>
			<th class="cMain4">Tipo de Mídia</th>
			<th class="cMain4">Título</th>
			<th class="cMain4 hideOnMobile">Curado por</th>
			<th class="cMain4 hideOnMobile">Criado por</th>
		</tr>
	</thead>
	<tbody>
		{#each programs as program}
			<tr on:click={() => handleRowClick(program.id)}>
				<td>
					<img
						class="iconSize2"
						src={program.mediatype === 'music' ? musicIcon : podcastIcon}
						alt={program.mediatype === 'music' ? 'music' : 'podcast'}
					/>
				</td>
				<td>{program.title}</td>
				<td class="cMain2 hideOnMobile">
					{#each program.curators as curator, index}
						{curator}{index < program.curators.length - 1 ? ', ' : ''}
					{/each}
				</td>
				<td class="cMain2 hideOnMobile">
					{#each program.creators as creator, index}
						{creator}{index < program.creators.length - 1 ? ', ' : ''}
					{/each}
				</td>
				<td class="iconSize1 fowardIcon">
					<img class="iconSize1" src={forwardIcon} alt="forward" />
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;

		th,
		td {
			padding: 1rem;
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
		tbody tr:hover {
			background-color: var(--offSecondary);
			.fowardIcon {
				rotate: -45deg;
			}
		}

		tbody tr {
			cursor: pointer;
		}

		@media (max-width: 650px) {
			.hideOnMobile {
				display: none;
			}
		}
	}

	#titleDiv {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
