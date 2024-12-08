<script>
    import { goto } from '$app/navigation';

    let { data } = $props();
    let episode = data.episode;
    let program = data.program;

    console.log(episode);
    console.log(program);

    let streamingEmbedLink = (episode.streaminglink ? episode.streaminglink.replace('open.spotify.com/playlist', 'open.spotify.com/embed/playlist').split('?')[0] : '')

    import undoIcon from '$lib/icons/undo.svg';
</script>

<!--title section-->
<div class="spaceBetween">
    <div id="titleDiv">
        <button onclick={() => goto(`/studio/programs/${program.id}`)}
            ><img src={undoIcon} alt="Undo" class="iconSize2" /></button
        >
        <h1 class="tSize3">{episode.title} <b class="cMain3 tSize2">({episode.number}º Episódio)</b> </h1>
    </div>
        <button onclick={() => goto(`/studio/programs/${program.id}/${episode.number}/edit`)} class="whiteButton">Editar</button>
</div>

<!--stakeholders section-->
<div id="stakeholdersDiv" class="mTop-xl mBottom-xxl">
    <div>
        <h2 class="tSize1 cMain4 mBottom-s">Curado por</h2>
        <p class="tSize2">
            {#each episode.curators as curator, index}
                {curator}{index < episode.curators.length - 1 ? ', ' : ''}
            {/each}
        </p>
    </div>
    <div>
        <h2 class="tSize1 cMain4 mBottom-s">Duração</h2>
        <p class="tSize2">
            {Math.floor(episode.duration / 3600) > 0 ? `${Math.floor(episode.duration / 3600)} hr, ` : ''}
            {Math.floor((episode.duration % 3600) / 60) > 0 ? `${Math.floor((episode.duration % 3600) / 60)} min, ` : ''}
            {episode.duration % 60} seg
        </p>
    </div>
</div>

<!--synopsis-->
<p id="synopsis" class="cMain3 mBottom-xxxl">
    {episode.synopsis}
</p>

<!--spotify embed-->
<iframe title="spotifyPreview" style="border-radius:12px" src={streamingEmbedLink} width="100%" height="600" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

<style>
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