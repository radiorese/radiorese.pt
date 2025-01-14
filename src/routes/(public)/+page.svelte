<script>
	import { onMount } from 'svelte';

	import shape1 from '$lib/assets/shape1.svg';
	import shape2 from '$lib/assets/shape2.svg';
	import shape3 from '$lib/assets/shape3.svg';
	import shape4 from '$lib/assets/shape4.svg';

	let strings1 = ["a iniciativa", "a vontade", "a coragem", "a ousadia", "a criatividade", "a inovação", "o impulso", "a proposta", "o movimento"];
	let strings2 = ["criação", "expressão", "produção", "manifestação", "concepção"];

	let string1 = $state("iniciativa");
	let string2 = $state("criação");

	onMount(() => {
		const interval = setInterval(() => {
			string1 = pickRandomElement(strings1);
			string2 = pickRandomElement(strings2);	
		}, 650);

		return () => clearInterval(interval);
	});

	function pickRandomElement(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	let innerWidth = $state();
	let innerHeight = $state();

	let links = [
		{
			name: "Arquivo de Fotografias",
			link: "https://drive.google.com/drive/folders/1Xbn5-D_r3I-fIWErJg3P1tMEVqmqCUIT?usp=sharing",
			margin: 0.3,
			shape: shape4
		},
		{
			name: "Instagram",
			link: "https://www.instagram.com/radiorese.pt?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
			margin: 0.9,
			shape: shape1
		}
	]
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="visualizerContainer">
	<h1 class="tSize6">D{string1.slice(0, 2)}<b class="tSize6 variatingBackground">{string1.slice(2, 1000)}</b> estudantil <br> para a liberdade de <b class="tSize6 variatingBackground">{string2}</b></h1>
</div>

<div id="linksSection" class="mTop-xxxl">
	<div id="title">
		<h1 class="tSize4 mBottom-l">
			Sintoniza-te
			<hr id="underline1" class="underline" />
			<hr id="underline2" class="underline" />
		</h1>
	</div>
	<div id="links" class="mTop-m mBottom-xxxl">
		{#each links as link}
			<a href={link.link} target="_blank" rel="noopener noreferrer" 
				style={innerWidth > 800 ?
					`margin: ${(link.margin) * innerHeight/6}px 0px 0px 0px;`
					:
					`margin: 0px 0px 0px ${(link.margin) * innerWidth/2.5}px;`
				}
			>
				<img src={link.shape} alt="Shape" class="shape" />
				<p class="tSize2 cMain1 mBottom-l linkText" >{link.name}</p>
			</a>
		{/each}
	</div>
</div>

<style>
	.visualizerContainer {
		height: 100vh;
		width: 100%;
		display: flex;
		padding: var(--globalMargin);
		justify-content: left;
		align-items: center;	
		background: radial-gradient(ellipse at top, var(--offSecondary), transparent),
		radial-gradient(ellipse at bottom, var(--secondary), transparent);
	}

	.variatingBackground {
		animation: backgroundChange 10s infinite;
	}

	@keyframes backgroundChange {
		0% { background-color: var(--red); }
		20% { background-color: var(--orange); }
		40% { background-color: var(--green); }
		60% { background-color: var(--blue); }
		80% { background-color: var(--magenta); }
		100% { background-color: var(--red); }
	}

	#linksSection {
		#title {
			position: relative;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			h1{
				position:relative;
			}

			#underline1 {
				position: absolute;
				bottom: -2.2rem;
				rotate: -0.6deg;
				border: 3px solid var(--red);
				color: var(--orange);
				width: 100%;
			}

			#underline2 {
				position: absolute;
				bottom: -1.4rem;
				rotate: 1.2deg;
				border: 3px solid var(--red);
				color: var(--orange);
				width: 100%;
			}
		}

		#links{
			display: flex;
			flex-direction: row;
			justify-content: center;
			gap: 8rem;
			min-height: 40svh;
			
			a{
				position: relative;
				height: fit-content;
				width: fit-content;
				img{
					width: 8rem;
					transition: rotate 0.25s;
					rotate: 0deg;
				}

				p {
					width: 10ch;
					position: absolute;
					top: 30%;
					left: 50%;
				}
			}

			a:hover{
				img{
					rotate: 25deg;
				}
			}
		}
	}

	@media (max-width: 800px) {
		#linksSection {
			#links {
				flex-direction: column;
				gap: 5rem;
			}
		}
	}
</style>
