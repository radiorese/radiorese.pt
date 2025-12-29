<script>
    import { goto } from '$app/navigation';
    import { ToggleGroup } from "bits-ui";
    let { data } = $props();
    let programs = data.programs;
    let userIsAdmin = data.userIsAdmin;

    import musicIcon from '$lib/icons/music.svg';
    import podcastIcon from '$lib/icons/podcast.svg';

    import forwardIcon from '$lib/icons/forward.svg';

    let selectedValues = $state('all');
    let searchTerm = $state('');

    let filteredPrograms = $derived(data.programs.filter((program) => {
        const matchesSearch = searchTerm === '' || 
            program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.curators.some((curator) => curator.toLowerCase().includes(searchTerm.toLowerCase())) ||
            program.creators.some((creator) => creator.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesMediaType = selectedValues === 'all' || selectedValues === program.mediatype;
        
        return matchesSearch && matchesMediaType;
    }));

    function handleRowClick(programId) {
        goto(`/studio/programs/${programId}`);
    }
</script>

{#if userIsAdmin}
    <div id="titleDiv">
        <h1 class="tSize3">Programas <b class="cMain3 tSize3">({filteredPrograms.length})</b></h1>
    </div>
{:else}
    <h1 class="tSize3">Os teus programas <b class="cMain3 tSize3">({filteredPrograms.length})</b></h1>
{/if}

<div id="toolBar" class="mTop-xl">

    <ToggleGroup.Root class="hideOnMobile" type="single" bind:value={selectedValues}>
        <ToggleGroup.Item value="all">Todos</ToggleGroup.Item>
        <ToggleGroup.Item value="podcast">Rubricas</ToggleGroup.Item>
        <ToggleGroup.Item value="music">Música</ToggleGroup.Item>
    </ToggleGroup.Root>

    <input
        class="bRadius0-5"
        type="text"
        placeholder="Procurar..."
        bind:value={searchTerm}
    />

    {#if userIsAdmin}
        <a href="/studio/programs/newProgram">
            <button id="newProgram" class="whiteButton">+</button>
        </a>
    {/if}
</div>

{#if filteredPrograms.length === 0}
    <p class="mTop-xl cMain2">Nenhum programa encontrado.</p>
{:else}
    <table class="mTop-xl plainTable">
        <thead>
            <tr>
                <th class="cMain3">Mídia</th>
                <th class="cMain3">Título</th>
                <th class="cMain3 hideOnMobile">Curado por</th>
                <th class="cMain3 hideOnMobile">Criado por</th>
            </tr>
        </thead>
        
        <tbody>
            {#each filteredPrograms as program}
                <tr onclick={() => handleRowClick(program.id)} class="mBottom-s cursorPointer">
                    <td>
                        <img
                            class="iconSize2"
                            src={program.mediatype === 'music' ? musicIcon : podcastIcon}
                            alt={program.mediatype === 'music' ? 'music' : 'podcast'}
                        />
                    </td>
                    <td>{program.title}</td>
                    <td class="cMain3 hideOnMobile">
                        {#each program.curators as curator, index}
                            {curator}{index < program.curators.length - 1 ? ', ' : ''}
                        {/each}
                    </td>
                    <td class="cMain3 hideOnMobile">
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
{/if}

<style>
	

	#titleDiv {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	#toolBar {

        input{
            height: 100%;
            border: 1px solid var(--main5);
            min-width: 0px;
            width: 100%;
        }

        input:focus{
            border:1px solid var(--main3);
        }

        #newProgram{
            font-size: 1.3rem;
            padding: 0px;
            height: 3rem;
            width: 3rem;
            white-space: no-wrap;
            padding: none;
            text-align: center;
        }

    }
</style>
