<script>
    let { data, form } = $props();

    let program = data.program;

    let userRole = data.userRole;

    console.log(program);

    let streamingLink = $state('');
    let streamingEmbedLink = $derived(streamingLink ? streamingLink.replace('open.spotify.com/playlist', 'open.spotify.com/embed/playlist').split('?')[0] : '');

    let members = data.members;

    let numberOfCurators = $state(program.curators.length);
    let curators = $state([]);

    let number = $state(Math.max(...program.episodes.map(e => e.number)) + 1);

    import undoIcon from '$lib/icons/undo.svg';
    import deleteIcon from '$lib/icons/delete.svg';

	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);
    
    
</script>

{#if userRole != null} 

<!--title section-->
<div id="titleDiv" class="mBottom-xl">
	<a class="iconSize2" href="/studio/programs/{program.id}">
		<img class="iconSize2" src={undoIcon} alt="Undo Icon" />
	</a>
	<h1 class="tSize3">Novo Episódio <b class="cMain3">({program.title})</b></h1>
</div>

{#if form?.error}
	<p class="error cRed mBottom-xl">{form.error}</p>
{/if}

<!--form section-->
<form method="POST" action="?/addEpisode">

    <!--episode table input section-->
    <div class="mTop-xl bRadius1">
        <input type="hidden" name="programId" value={program.id} />
		<label for="number">
			<h3><b class="bold cRed">·</b> Número do Episódio</h3>
			<input type="number" id="number" name="number" class="solidBorder bRadius1" bind:value={number} required />
		</label>
		<label for="title">
			<h3 class="mTop-xl"><b class="bold cRed">·</b> Título do Episódio</h3>
			<input type="text" id="title" name="title" class="solidBorder bRadius1" required />
		</label>
		
		<label for="duration" id="duration">
			<input type="hidden" name="duration" value={hours * 3600 + minutes * 60 + seconds} />
			<h3 class="mTop-xl"><b class="bold cRed">·</b> Duração (com precisão ao segundo)</h3>
			<div>
				<input type="number" id="hours" class="solidBorder bRadius1" bind:value={hours} required />
				<p class="cMain3">hr</p>
				<input type="number" id="minutes" class="solidBorder bRadius1" bind:value={minutes} required />
				<p class="cMain3">min</p>
				<input type="number" id="seconds" class="solidBorder bRadius1" bind:value={seconds} required />
				<p class="cMain3">seg</p>
			</div>
		</label>

		<label for="synopsis">
			<h3 class="mTop-xl">Sinopse</h3>
			<textarea id="synopsis" name="synopsis" class="bRadius1"></textarea>
		</label>
        <label for='fileLink'>
            <h3 class="mTop-xl"><b class="bold cRed">·</b> Link de download (Google Drive)</h3>
            <input type='text' id='fileLink' name='fileLink' class='solidBorder bRadius1' required />
        </label>
        <label for='streamingLink'>
            <h3 class="mTop-xl">Link do Spotify</h3>
            <input type='text' id='streamingLink' name="streamingLink" class='solidBorder bRadius1' bind:value={streamingLink}/>
        </label>
        <!--spotify preview-->
        {#if streamingEmbedLink}
            <label for='preview' id="preview">
                <h3 class="bRadius1"><b class="bold cRed">¡</b> Preview <b class="bold cRed">!</b></h3>
                <p class="cMain3">Deve aparecer a playlist numa janela do spotify em baixo. Caso não apareça, tenta tornar a tua playlist pública. Se o problema se persistir, contacta o(a) coorderador(a) do teu departamento.</p>
                <iframe title="spotifyPreview" style="border-radius:12px" src={streamingEmbedLink} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </label>
        {/if}
	</div>
    
    <!--curators table input section-->
    <div class="mTop-xl bRadius1">
        <input type="hidden" name="curators" value={JSON.stringify(curators)}>
        <label for="curators" id="curators">
			<h3 class=""><b class="bold cRed">·</b> Curado Por</h3>
			{#each Array(numberOfCurators) as _, index}
				<div>
					<select id="curators{index}" bind:value={curators[index]} class="bRadius1" required>
						{#each members as member}
							{#if !curators.slice(0, index).includes(member.account_id)}
								<option 
									selected={program.curators[index] == member.name ? true : undefined}
									value={member.account_id}
									>{member.name}
								</option>
							{/if}
						{/each}
					</select>
					{#if index > 0}
						<button
							type="button"
							class="delete"
							aria-label="delete"
							onclick={() => {
								numberOfCurators -= 1;
								curators = curators.slice(0, index);
							}}
							><image class="iconSize2" src={deleteIcon} alt="deleteButton"></image>
						</button>
					{/if}
				</div>
			{/each}
			<button
				type="button"
				class="dashedBorder bRadius1 add"
				onclick={() => {
					numberOfCurators += 1;
				}}>Add Curator</button
			>
		</label>
    </div>

    <!--submit button-->
    <button type="submit" class="bRadius1 mTop-xl">Submeter Episódio</button>
</form>

{/if}

<style>
    #titleDiv {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

    form {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: right;
        gap: 1rem;

		> div {
            width: calc(50% - 0.5rem);
			background-color: var(--offSecondary);
			padding: 1rem;
            height: fit-content;

			h3,
			select,
			input,
			textarea {
				width: 100%;
			}


			.add {
				padding: 1.2rem;
			}

			div {
				display: flex;
				gap: 1rem;
				align-items: center;
			}

            #preview {
                padding: 1rem;
                border-radius: .5rem;
                background-color: var(--secondary);
                margin-top: 2.618em;
            }

			#duration > div {
				display: flex;
				gap: 1rem;
				align-items: center;
				> input {
					width: 6rem;
				}
			}
		}
		@media (max-width: 900px) {
			> div {
				width: 100%;
			}
		}

        [type=submit] {
            padding: 1rem;
            background-color: var(--main1);
            color: var(--secondary);
        }
	}

    label {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>