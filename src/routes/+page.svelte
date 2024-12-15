<script>
    let possibleStrings = ['Rádio', 'Escola', 'Superior', 'de', 'Educação'];

    let string = $state();
    let lastString = '';

    function pickRandomString() {
        let newString;
        do {
            newString = possibleStrings[Math.floor(Math.random() * possibleStrings.length)];
        } while (newString === lastString);
        string = newString;
        lastString = newString;
    }

    setInterval(pickRandomString, 200);
</script>

<div>
    <h1 class="tSize2">{string}</h1>
</div>

<style>
	div {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100svh;

		animation: rainbow 10s ease infinite;

        display: flex;
        justify-content: center;
        align-items: center;
	}

	@keyframes rainbow {
		0%,
		100% {
			background-color: var(--red);
		}
		16.6% {
			background-color: var(--orange);
		}
		33.3% {
			background-color: var(--yellow);
		}
		50% {
			background-color: var(--green);
		}
		66.6% {
			background-color: var(--blue);
		}
		83.3% {
			background-color: var(--magenta);
		}
	}
</style>
