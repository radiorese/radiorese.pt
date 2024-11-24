<slot />

<style>
	/* color and font variables */

	:root {
		--main1: rgb(255, 255, 255);
		--main2: rgb(208, 208, 208);
		--main3: rgb(161, 161, 161);
		--main4: rgb(113, 113, 113);
		--main5: rgb(65, 65, 65);
		--secondary: rgb(18, 18, 18);

		--headerHeight:60px;
		--globalMargin:2rem;
	}

	@media (max-width: 760px) {
		:root{
			--globalMargin:1rem;
		}
	}

	@font-face {
		font-family: 'ApfelGrotezkRegular';
		src: url('$lib/fonts/ApfelGrotezk-Regular.otf');
	}

	@font-face {
		font-family: 'ApfelGrotezkBold';
		src: url('$lib/fonts/ApfelGrotezk-Fett.otf');
	}

	/* defaulting some objects */

	:global(*) {
		box-sizing: border-box;
	}

	:global(button) {
		font-family: 'ApfelGrotezkRegular', serif; /* Ensure font-family is in quotes */
		background-color: transparent;
		border: none;
		color: var(--main1);
		padding: 0;
		text-decoration: none;
		text-align: left;
		cursor: pointer;
	}

	:global(h1, h2, h3, h4, h5, p, a) {
		margin: 0;
		font-weight: normal;
		text-align: left;
	}

	/* global styles */

	:global(html) {
		font-size: 100%;
		background-color: var(--secondary);
	}

    :global(body) {
        margin-right: var(--globalMargin);
        margin-left: var(--globalMargin);
        margin-bottom: var(--globalMargin);
        margin-top:0;
    }

	:global(h1, h2, h3, h4, h5, p, a) {
		font-family: 'ApfelGrotezkRegular', serif;
		color: var(--main1);
		text-decoration: none;
	}

	:global(.bold) {
		font-family: 'ApfelGrotezkBold', serif;
	}

    :global(.glassMorphic) {
		background: linear-gradient(0deg, rgba(18, 18, 18, 0.6) 0%, rgba(18, 18, 18, 0.6) 100%),
			linear-gradient(171deg, rgba(255, 255, 255, 0.01) 0.19%, rgba(255, 255, 255, 0) 101.78%);
		backdrop-filter: blur(37.5px);
	}

    :global(.tSize1) {
        font-size: 1rem;
    }

    :global(.tSize2) {
        font-size: 1.5rem;
    }

    :global(.tSize3) {
        font-size: 2rem;
    }

	:global(.cMain1) {
		color: var(--main1);
	}

	:global(.cMain2) {
		color: var(--main2);
	}

	:global(.cMain3) {
		color: var(--main3);
	}

	:global(.cMain4) {
		color: var(--main4);
	}

	:global(.cMain5) {
		color: var(--main5);
	}

	:global(.cSecondary) {
		color: var(--secondary);
	}
</style>
