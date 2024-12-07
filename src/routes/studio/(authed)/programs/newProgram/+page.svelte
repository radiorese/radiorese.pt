<script>
	let { data } = $props();

	let allMembers = data.allMembers;
	let activeMembers = data.activeMembers;

	let numberOfCreators = $state(1);
	let creators = $state([]);

	let numberOfCurators = $state(1);
	let curators = $state([]);

	import undoIcon from '$lib/icons/undo.svg';
	import deleteIcon from '$lib/icons/delete.svg';
</script>

<div id="titleDiv" class="mBottom-xl">
	<a class="iconSize2" href="/studio/programs">
		<img class="iconSize2" src={undoIcon} alt="Undo Icon" />
	</a>
	<h1 class="tSize3">Novo Programa</h1>
</div>

<form method="POST" action="?/addProgram">
	<div class="mTop-xl bRadius1">
		<label for="mediaType">
			<h3>Tipo de Mídia</h3>
			<select id="mediaType" name="mediaType" class="bRadius1" required>
				<option value="music">Music</option>
				<option value="podcast">Podcast</option>
			</select>
		</label>
		<label for="title">
			<h3 class="mTop-xl">Título</h3>
			<input type="text" id="title" name="title" class="solidBorder bRadius1" required />
		</label>
		<label for="sinopsis">
			<h3 class="mTop-xl">Sinopse</h3>
			<textarea id="sinopsis" name="synopsis" class="bRadius1"></textarea>
		</label>
	</div>

	

	<div class="mTop-xl bRadius1">
	<input type="hidden" name="creators" value={JSON.stringify(creators)} />
	<input type="hidden" name="curators" value={JSON.stringify(curators)} />
		<label for="creators" id="creators">
			<h3>Criado Por</h3>
			{#each Array(numberOfCreators) as _, index}
				<div>
					<select id="creators{index}" bind:value={creators[index]} class="bRadius1" required>
						{#each allMembers as member}
							{#if !creators.slice(0, index).includes(member.account_id)}
								<option value={member.account_id}>{member.name}</option>
							{/if}
						{/each}
					</select>
					{#if index > 0}
						<button
							type="button"
							class="delete"
							aria-label="delete"
							onclick={() => {
								numberOfCreators -= 1;
								creators = creators.slice(0, index);
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
					numberOfCreators += 1;
				}}>Add Creator</button
			>
		</label>
		<label for="curators" id="curators">
			<h3 class="mTop-xl">Curado Por</h3>
			{#each Array(numberOfCurators) as _, index}
				<div>
					<select id="curators{index}" bind:value={curators[index]} class="bRadius1" required>
						{#each activeMembers as member}
							{#if !curators.slice(0, index).includes(member.account_id)}
								<option value={member.account_id}>{member.name}</option>
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

	<button type="submit" class="bRadius1 mTop-xl">Criar Programa</button>
</form>

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
