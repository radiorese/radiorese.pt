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
		--offSecondary: rgb(25, 25, 25);

		--red: rgb(255, 0, 0);
		--green: rgb(0, 255, 0);

		--headerHeight: 60px;

		--globalMargin: 2rem;
		--doubleGlobalMargin: 4rem;

		--globalTransitionTime: 0.25s;
	}

	@media (max-width: 760px) {
		:root {
			--globalMargin: 1rem;
			--doubleGlobalMargin: 2rem;
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

	:global(
			h1,
			h2,
			h3,
			h4,
			h5,
			p,
			a,
			b,
			th,
			td,
			input[type='text'],
			input[type='email'],
			input[type='tel'],
			input[type='password'],
			option,
			select,
			textarea
		) {
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
		margin-top: 0;
	}

	:global(
			h1,
			h2,
			h3,
			h4,
			h5,
			p,
			a,
			b,
			th,
			td,
			input[type='text'],
			input[type='email'],
			input[type='tel'],
			input[type='password'],
			select,
			option,
			textarea
		) {
		font-family: 'ApfelGrotezkRegular', serif;
		color: var(--main1);
		text-decoration: none;
		font-size: 1rem;
	}

	:global(
			input[type='text'],
			input[type='email'],
			input[type='tel'],
			input[type='password'],
			select,
			textarea
		) {
		
		background-color: transparent;
		color: var(--main1);
		padding: 1rem;
	}

	:global(textarea) {
		min-height: 10rem;
		resize: none;
	}

	:global(option) {
		background-color: var(--secondary);
		color: var(--main1);
	}

	:global(option:hover)	{
		background-color: var(--offSecondary);
	}

	:global(.bold) {
		font-family: 'ApfelGrotezkBold', serif;
	}

	:global(.glassMorphic) {
		background: linear-gradient(0deg, rgba(18, 18, 18, 0.6) 0%, rgba(18, 18, 18, 0.6) 100%),
			linear-gradient(171deg, rgba(255, 255, 255, 0.01) 0.19%, rgba(255, 255, 255, 0) 101.78%);
		backdrop-filter: blur(37.5px);
	}

	:global(.noBorder) {
		border: none;
	}

	:global(.solidBorder) {
		border: 1px solid var(--main3);
	}

	:global(.dashedBorder) {
		border: 1px dashed var(--main3);
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

	:global(.iconSize1) {
		width: 1rem;
		height: 1rem;
	}

	:global(.iconSize2) {
		width: 1.5rem;
		height: 1.5rem;
	}

	:global(.iconSize3) {
		width: 2rem;
		height: 2rem;
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

	:global(.cOffSecondary) {
		color: var(--offSecondary);
	}

	:global(.cRed) {
		color: var(--red);
	}

	:global(.cGreen) {
		color: var(--green);
	}

	/*border radius*/

	:global(.bRadius1) {
		border-radius: 1rem;
	}

	:global(.bRadius2) {
		border-radius: 4rem;
	}

	:global(.bRadius3) {
		border-radius: 1000rem;
	}

	/* spacing*/

	:global(.spaceBetween) {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	:global(.whiteButton){
		background-color: var(--main1);
		color: var(--secondary);
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		font-size: 1rem;
	}

	:global(.mBottom-xs) {
		margin-bottom: 0.128em;
	}

	:global(.mBottom-s) {
		margin-bottom: 0.272em;
	}

	:global(.mBottom-m) {
		margin-bottom: 0.618em;
	}

	:global(.mBottom-l) {
		margin-bottom: 1em;
	}

	:global(.mBottom-xl) {
		margin-bottom: 1.618em;
	}

	:global(.mBottom-xxl) {
		margin-bottom: 2.618em;
	}

	:global(.mBottom-xxxl) {
		margin-bottom: 4.236em;
	}

	:global(.mTop-xs) {
		margin-top: 0.128em;
	}

	:global(.mTop-s) {
		margin-top: 0.272em;
	}

	:global(.mTop-m) {
		margin-top: 0.618em;
	}

	:global(.mTop-l) {
		margin-top: 1em;
	}

	:global(.mTop-xl) {
		margin-top: 1.618em;
	}

	:global(.mTop-xxl) {
		margin-top: 2.618em;
	}

	:global(.mTop-xxxl) {
		margin-top: 4.236em;
	}

	:global(.mLeft-xs) {
		margin-left: 0.128em;
	}

	:global(.mLeft-s) {
		margin-left: 0.272em;
	}

	:global(.mLeft-m) {
		margin-left: 0.618em;
	}

	:global(.mLeft-l) {
		margin-left: 1em;
	}

	:global(.mLeft-xl) {
		margin-left: 1.618em;
	}

	:global(.mLeft-xxl) {
		margin-left: 2.618em;
	}

	:global(.mLeft-xxxl) {
		margin-left: 4.236em;
	}

	:global(.mRight-xs) {
		margin-right: 0.128em;
	}

	:global(.mRight-s) {
		margin-right: 0.272em;
	}

	:global(.mRight-m) {
		margin-right: 0.618em;
	}

	:global(.mRight-l) {
		margin-right: 1em;
	}

	:global(.mRight-xl) {
		margin-right: 1.618em;
	}

	:global(.mRight-xxl) {
		margin-right: 2.618em;
	}

	:global(.mRight-xxxl) {
		margin-right: 4.236em;
	}
</style>
