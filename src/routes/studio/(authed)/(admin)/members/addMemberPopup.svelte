<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let isactive = true;

    function cancel() {
        dispatch('close');
    }
</script>

<div class="popup solidBorder bRadius1">
    <form class="tSize1" method="POST" action="?/addMember">
        <h1 class="tSize3">Adicionar Membro</h1>
        <p class="mBottom-xl cMain5">Cria um novo membro preenchendo todos os campos.</p>
        <label>
            <h3 class="cMain4">Está ativo?</h3>
            <input name='isActive' type="checkbox" bind:checked={isactive} />
        </label>
        <label>
            <h3 class="cMain4">Nome</h3>
            <input name='name' type="text" class="tSize1 bRadius1 solidBorder" required placeholder='Rafa Silva Arias'/>
        </label>
		<label>
            <h3 class="cMain4">@</h3>
            <input name='at' type="text" class="tSize1 bRadius1 solidBorder" required placeholder='rafasilvaarias'/>
        </label>
        <label>
            <h3 class="cMain4">Email</h3>
            <input name='email' type="email" class="tSize1 bRadius1 solidBorder" required placeholder='arias.rafael@outlook.pt'/>
        </label>
        <label>
            <h3 class="cMain4">Telemóvel</h3>
            <input name='phone' type="tel" class="tSize1 bRadius1 solidBorder" required placeholder='934472501' />
        </label>
        <div class="mTop-xl">
            <button type="button" class="bRadius1 solidBorder" on:click={cancel}>Cancelar</button>
            <button id='submit' type="submit" class="bRadius1">Criar Membro</button>
        </div>
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
        max-width: 400px;
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

        div{
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            button{
                width: 100%;
                text-align: center;
                height: 3.5rem;

            }
            #submit{
                background-color: var(--main1);
                color: var(--secondary);
            }
        }

        label{
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1.5rem;
            justify-content: space-between;
            margin-bottom: 1rem;

            h3{
                text-align: right;
                width: 130px;
            }
            input[type=text], input[type=email], input[type=tel], input[type=checkbox]{
                width: 100%;
            }
        }
    }
</style>
