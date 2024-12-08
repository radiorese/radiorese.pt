<script>
	import undoIcon from '$lib/icons/undo.svg';

	import { goto } from '$app/navigation';
	let { data , form } = $props();

	if (data.userRole != 'programCurator') {
		goto('/studio/programs');
	}

	let program = data.program;
	let userRole = data.userRole;

	let title = $state(program.title);
	let synopsis = $state(program.synopsis);

</script>

{#if userRole === 'programCurator'}
	<!--title section-->
	<div id="titleDiv" class="mBottom-xl">
		<button onclick={() => goto(`/studio/programs/${program.id}`)}>
			<img src={undoIcon} alt="Undo" class="iconSize2" />
		</button>
		<h1 class="tSize3">{title}</h1>
	</div>

	<!--feedback section-->
	{#if form?.error}
		<p class="error cRed mBottom-xl">{form.error}</p>
	{/if}

	<!--form-->
	<form method="POST" action="?/editProgram">
		<input type="hidden" name="id" value={program.id}/>
		<div class="bRadius1">
			<label for="title">
				<h3 class="mBottom-m"><b class="bold cRed">·</b> Título</h3>
				<input
					name="title"
					class="solidBorder bRadius1"
					type="text"
					id="title"
					bind:value={title}
					required
				/>
			</label>

			<label for="synopsis">
				<h3 class="mBottom-m">Sinopse</h3>
				<textarea name="synopsis" class="solidBorder bRadius1" id="synopsis" bind:value={synopsis}
				></textarea>
			</label>
		</div>

		<button class="whiteButton mTop-xl" type="submit">Guardar Alterações</button>
	</form>
{/if}

<style>
	#titleDiv {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	form {
		div {
			background-color: var(--offSecondary);
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 2rem;
		}

		input,
		textarea {
			width: 100%;
		}
	}
</style>
