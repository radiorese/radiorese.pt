<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    import editIcon from '$lib/icons/edit.svg';
    import closeIcon from '$lib/icons/close.svg';
    import deleteIcon from '$lib/icons/delete.svg';
    import copyIcon from '$lib/icons/copy.svg';

	export let isEditing;
	export let selectedMember;

	function toggleIsEditing() {
		isEditing = !isEditing;
	}

	function cancel() {
		dispatch('close');
	}
</script>

<div class="popup solidBorder bRadius1">
	<form class="tSize1" method="POST" action="?/editMember">
		<div id="titleDiv">
			<h1 class="tSize3">{selectedMember.name}</h1>
			<div>
                {#if !isEditing}
                    <button on:click={toggleIsEditing}>
                        <img class="iconSize2" src={editIcon} alt="Editar Membro"/>
                    </button>
                {:else}
                    <button type="submit" formmethod="POST" formaction="?/deleteMember">
                        <img class="iconSize2" src={deleteIcon} alt="Eliminar Member"/>
                    </button>
                {/if}
                <button on:click={cancel}>
                    <img class="iconSize2" src={closeIcon} alt="Fechar Janela"/>
                </button>
            </div>
		</div>
		<label>
            {#if isEditing}
                <h3 class="cMain4"><b class="bold cRed">·</b> Está ativo?</h3>
                <input name="isActive" type="checkbox" bind:checked={selectedMember.isactive} readonly={!isEditing} />
            {/if}
		</label>
		<label>
			<h3 class="cMain4">
				{#if isEditing}
					<b class="bold cRed">·</b>
				{/if}
				Nome
			</h3>
			<input
				name="name"
				type="text"
				class="tSize1 bRadius1 {isEditing ? 'solidBorder' : 'noBorder'}"
				required
				bind:value={selectedMember.name}
                readonly={!isEditing}
			/>
		</label>
		<label>
			<h3 class="cMain4">
				{#if isEditing}
					<b class="bold cRed">·</b>
				{/if}
				@
			</h3>
			<input
				name="at"
				type="text"
				class="tSize1 bRadius1 {isEditing ? 'solidBorder' : 'noBorder'}"
				required
				bind:value={selectedMember.at}
                readonly={!isEditing}
			/>
		</label>
		<label>
			<h3 class="cMain4">
				{#if isEditing}
					<b class="bold cRed">·</b>
				{/if}
				Email
			</h3>
			<input
				name="email"
				type="email"
				class="tSize1 bRadius1 {isEditing ? 'solidBorder' : 'noBorder'}"
				required
				bind:value={selectedMember.email}
                readonly={!isEditing}
			/>
            {#if !isEditing}
                <button type="button" on:click={() => navigator.clipboard.writeText(selectedMember.email)}>
                    <img class="iconSize2" src={copyIcon} alt="Copiar Email"/>
                </button>
            {/if}
		</label>
		<label>
			<h3 class="cMain4">
				{#if isEditing}
					<b class="bold cRed">·</b>
				{/if}
				Telemóvel
			</h3>
			<input
				name="phone"
				type="tel"
				class="tSize1 bRadius1 {isEditing ? 'solidBorder' : 'noBorder'}"
				required
				bind:value={selectedMember.phone}
                readonly={!isEditing}
			/>
            {#if !isEditing}
                <button type="button" on:click={() => navigator.clipboard.writeText(selectedMember.phone)}>
                    <img class="iconSize2" src={copyIcon} alt="Copiar Email"/>
                </button>
            {/if}
		</label>
        <input
            name="id"
			type="text"
            value={selectedMember.account_id}
            style="display: none;"
            readonly
        />
        
		{#if isEditing}
			<div class="mTop-xl">
				<button
					type="button"
					class="bRadius1 {isEditing ? 'solidBorder' : 'noBorder'}"
					on:click={toggleIsEditing}>Cancelar</button
				>
				<button id="submit" type="submit" class="bRadius1">Editar Membro</button>
			</div>
		{/if}
	</form>
</div>

<style>
	.popup {
		z-index: 2;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 2rem;
		gap: 1rem;
		background: var(--secondary);
		max-width: 500px;
		width: 100%;

		label,
		button {
			font-size: 1rem;
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

        #titleDiv {
            align-items: baseline;
        }

		div {
			display: flex;
			justify-content: space-between;
			gap: 1rem;
			button {
				width: 100%;
				text-align: center;
				height: 3.5rem;
			}
			#submit {
				background-color: var(--main1);
				color: var(--secondary);
			}
		}

		label {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1.5rem;
			justify-content: space-between;
			margin-bottom: 1rem;

			h3 {
				text-align: right;
				width: 130px;
			}
			input[type='text'],
			input[type='email'],
			input[type='tel'],
			input[type='checkbox'] {
				width: 100%;
			}
		}
	}
</style>
