<script>
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
<table class="mBottom-m">
	<thead>
		<tr>
			<th class="cMain4">Episódio (Programa)</th>
			
		</tr>
	</thead>
	<tbody>
		{#each unavailableEpisodes as episode, index}
			<tr class="available">
				<td>
					{episode.title} <b class="cMain5">({episode.number}º Episódio)</b> <br> 
					<b class="cMain3">{episode.program.title}</b>
				</td>
				<td>
					<input
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
		<button type="submit" class="whiteButton">Já baixei os episódios</button>
	{/if}
</form>
{/if}



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
			td:nth-child(1),
			td:nth-child(3) {
				width: 5%;
			}

			td:nth-child(1){
				width: 90%;
			}
		}

		tbody tr:last-child {
			border-bottom: none;
		}
	}

	
</style>
