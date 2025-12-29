<script>
	import { goto } from '$app/navigation';
	let { data, form } = $props();

	let episodes = data.episodes;
	//console.log(episodes);

	
	let unavailableEpisodes = episodes;
	let selectedUnavailableEpisodes = $state([]);

	function toggleUnavailableEpisodeSelection(index, episode) {
		const episodeIndex = selectedUnavailableEpisodes.findIndex(
			(e) => e.programId === episode.program.id && e.number === episode.number
		);
		if (episodeIndex !== -1) {
			selectedUnavailableEpisodes.splice(episodeIndex, 1);
		} else {
			selectedUnavailableEpisodes.push({
				programId: episode.program.id,
				number: episode.number
			});
		}
	}


	function getDriveDownloadLink(originalLink) {
		const fileIdMatch = originalLink.match(/\/d\/([^/]+)\/view/);

		if (fileIdMatch && fileIdMatch[1]) {
			return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
		}

		return originalLink;
	}

	function goToEpisode(id, number){
		goto(`/studio/programs/${id}/${number}`);
	}

	function goToProgram(id){
		goto(`/studio/programs/${id}`);
	}

	import downloadIcon from '$lib/icons/download.svg';
</script>

<!--Error Message-->

{#if form && form.error}
    <p class="cRed">{form.error}</p>
{/if}

<!--Non Downloaded Episodes-->

<h1 class="tSize3 mBottom-m">
	Episódios por Baixar <b class="cMain3 tSize2">({unavailableEpisodes.length})</b>
</h1>

{#if unavailableEpisodes.length === 0}
	<p class="mBottom-m">Todos os episódios estão baixados localmente.</p>
{:else}
<table class="mBottom-m plainTable">
	<thead>
		<tr>
			<th class="cMain4">Episódio (Programa)</th>
			
		</tr>
	</thead>
	<tbody>
		{#each unavailableEpisodes as episode, index}
			<tr class="available">
				<td>
					<a class="cursorPointer" onclick={goToProgram(episode.program_id, episode.number)}>{episode.title} <b class="cMain5">({episode.number}º Episódio)</b> </a> <br> 
					<a class="cursorPointer" onclick={goToEpisode(episode.program_id, episode.number)}><b class="cMain3">{episode.program.title}</b></a>
					
				</td>
				<td>
					<input
						class="cursorPointer"
						type="checkbox"
						onchange={() => toggleUnavailableEpisodeSelection(index, episode)}
					/>
				</td>
				<td>
					<a aria-label="download" href={getDriveDownloadLink(episode.filelink)} target="_blank">
                        <image src={downloadIcon} class="iconSize1"></image>
                    </a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<form method="POST" action="?/markDownloads">
	<input
		type="hidden"
		name="episodes"
		value={JSON.stringify(selectedUnavailableEpisodes)}
	/>
	{#if selectedUnavailableEpisodes.length > 0}
		<button type="submit" class="whiteButton mTop-l">Já baixei os episódios</button>
	{/if}
</form>
{/if}



<style>
	table {
		tr {
			td:nth-child(3) {
				width: 5%;
			}

			td:nth-child(1){
				width: 90%;
			}
		}
	}

	
</style>
