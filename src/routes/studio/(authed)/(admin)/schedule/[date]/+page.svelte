<script>
	import { formatDateRange, isToday, isThisWeek } from '$lib/utils/dates.js';

	let { data } = $props();
	let mondayDate = data.mondayDate;
	let thisWeek = isThisWeek(mondayDate, new Date(mondayDate).setDate(new Date(mondayDate).getDate() + 6));
	let programs = data.allPrograms;

	import undoIcon from '$lib/icons/undo.svg';
	import forwardIcon from '$lib/icons/redo.svg';

	import deleteIcon from '$lib/icons/delete.svg';

	let startingHour = $state(10);
	let startingSeconds = $derived(startingHour * 60 * 60);

	let days = $state([
		{ name: 'Segunda', collapsed: false},
		{ name: 'Terça', collapsed: false},
		{ name: 'Quarta', collapsed: false},
		{ name: 'Quinta', collapsed: false},
		{ name: 'Sexta', collapsed: false},
		{ name: 'Sábado', collapsed: true},
		{ name: 'Domingo', collapsed: true}
	]);

	let episodes = $state(data.weeklySchedule);

	let dailyNumberOfEpisodes = $state(episodes.map(day => day.length));


	function goToPreviousWeek() {
		let previousWeek = new Date(mondayDate);
		previousWeek.setDate(previousWeek.getDate() - 7);
		window.location.href = `/studio/schedule/${previousWeek.toISOString().split('T')[0]}`;
	}

	function goToNextWeek() {
		let nextWeek = new Date(mondayDate);
		nextWeek.setDate(nextWeek.getDate() + 7);
		window.location.href = `/studio/schedule/${nextWeek.toISOString().split('T')[0]}`;
	}

	$effect(() => {
		setEpisodeDuration();
	});

	function setEpisodeDuration() {
		episodes.forEach((day, dayIndex) => {
			let duration = startingSeconds;
			day.forEach((episode, episodeIndex) => {
				const program = programs.find(p => p.id == episode.programId);
				const episodeDetails = program?.episodes.find(e => e.number == episode.episodeNumber);
				duration += episodeDetails?.duration || 0;
				episodes[dayIndex][episodeIndex].endingTime = duration;
			});
		});
	}

	function pasteEpisodes(pastedEpisodes) {
		episodes = pastedEpisodes;
		dailyNumberOfEpisodes = episodes.map(day => day.length);
		episodes.forEach((day, dayIndex) => {
			day.forEach((episode, episodeIndex) => {
				document.getElementById(`d${dayIndex}i${episodeIndex}p${episode.programId}`).selected = true;
				document.getElementById(`d${dayIndex}i${episodeIndex}p${episode.programId}e${episode.episodeNumber}`).selected = true;
			});
		});
	}

</script>

<main>
	<!--title section-->
	<div id="titleBanner">
		<button onclick={goToPreviousWeek} aria-label="Previous Week">
			<image src={undoIcon} alt="Previous Week" class="iconSize1" />
		</button>
		<div id="titleDiv">
			<h1 class="tSize2">Horário Semanal</h1>
			<h2 class="tSize2 cMain2">
				{formatDateRange(mondayDate)} - {formatDateRange(
					new Date(mondayDate).setDate(new Date(mondayDate).getDate() + 6)
				)}
				{#if thisWeek}
					<b class="tSize2 cRed"> (Esta Semana) </b>
				{/if}
			</h2>
		</div>
		<button onclick={goToNextWeek} aria-label="Next Week">
			<image src={forwardIcon} alt="Next Week" class="iconSize1" />
		</button>
	</div>

	<!--Form Section: Global Control and Schedule Days-->
	<form method="POST" action="?/submitSchedule">

		<!--Global Control Section-->
		<div id="middleBanner" class="bRadius1 mBottom-m">
			<p>
				Hora de Começo
				<input type="number" name="startingHour" bind:value={startingHour} min="0" max="23" />
			</p>

			<div>

			<button class="cRed" onclick={() => { event.preventDefault(); episodes = [[], [], [], [], [], [], [] ]; dailyNumberOfEpisodes = [0, 0, 0, 0, 0, 0, 0]; }}>
					Reset
				</button>
				
				<button onclick={() => { event.preventDefault(); navigator.clipboard.writeText(JSON.stringify(episodes)); }}>
					Copiar
				</button>
				<button onclick={() => { event.preventDefault(); pasteEpisodes(JSON.parse(prompt('Colar')))}}>
					Colar
				</button>
				
				<button type="submit"> Guardar </button>
			</div>
		</div>

		<!--Schedule Days Section-->
		<div id="scheduleDays" class="">

			<input type="hidden" name="episodes" value={JSON.stringify(episodes)} />
			<input type="hidden" name="mondayDate" value={mondayDate} />

			{#each days as day, dayIndex}
				<div class="dayDiv bRadius1">
					<!--Title-->
					<h1 class="tSize2">
						{day.name}

						<b class="cMain3 tSize2">
							{formatDateRange(
								new Date(mondayDate).setDate(new Date(mondayDate).getDate() + dayIndex)
							)}
						</b>

						{#if isToday(new Date(mondayDate).setDate(new Date(mondayDate).getDate() + dayIndex))}
							<b class="cRed tSize2"> (Hoje) </b>
						{/if}
					</h1>

					<h3 class="cMain3">{startingHour}h00</h3>

					<!--Episode Selection-->
					{#each Array(dailyNumberOfEpisodes[dayIndex]) as _, episodeIndex}

						<div class="flexRow">

							<div>

								<select
									required
									onchange={(event) => {
										episodes[dayIndex][episodeIndex] = {
											programId: event.target.value,
											episodeNumber: null
										};
									}}
								>
									<option value="" disabled selected>Programa</option>
									{#each programs as program}
										<option 
											id={"d"+dayIndex+"i"+episodeIndex+"p"+program.id}
											value={program.id}
											selected={episodes[dayIndex][episodeIndex]?.programId == program.id}
										>{program.title}</option>
									{/each}
								</select>
							

							
								{#if episodes[dayIndex][episodeIndex]?.programId}
									<select	
										required
										onchange={(event) => {
											episodes[dayIndex][episodeIndex].episodeNumber = event.target.value;
										}}
									>
										<option value="" disabled selected>Episódio</option>
										{#each programs.find(p => p.id == episodes[dayIndex][episodeIndex].programId).episodes as ep}
											<option
												id={"d"+dayIndex+"i"+episodeIndex+"p"+ep.program_id+"e"+ep.number}
												value={ep.number}
												selected={ep.number == episodes[dayIndex][episodeIndex]?.episodeNumber}
											>{ep.number}. {ep.title}</option>
										{/each}
									</select>
								{/if}

							</div>

							<button
								aria-label="Delete Episode"
								class="delete"
								onclick={() => {
									event.preventDefault();
									episodes[dayIndex].splice(episodeIndex, 1);
									dailyNumberOfEpisodes[dayIndex]--;
								}}
							>
								<image src={deleteIcon} alt="Delete Episode" class="iconSize1" />
							</button>

						</div>

						{#if episodes[dayIndex][episodeIndex]?.endingTime}
							<h3 class="cMain3 tSize1">
								{Math.floor(episodes[dayIndex][episodeIndex]?.endingTime / 3600)}h{String(Math.floor((episodes[dayIndex][episodeIndex]?.endingTime % 3600) / 60)).padStart(2, '0')}
							</h3>
						{:else}
							<h3 class="cMain3 tSize1">--h--</h3>
						{/if}
					{/each}


					<button
						class="add bRadius1 dashedBorder"
						onclick={() => {
							event.preventDefault();
							dailyNumberOfEpisodes[dayIndex]++;
						}}
					>
						Adicionar Episódio
					</button>
				</div>
			{/each}
		</div>

	</form>

</main>

<style>
	main {
		height: calc(100svh - var(--headerHeight) - var(--globalMargin));
		::-webkit-scrollbar {
			display: none;
		}
	}

	#titleBanner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		#titleDiv {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}

	#middleBanner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--offSecondary);
		padding: 0.8rem 2rem;

		input {
			width: 3rem;
			padding: 0.5rem;
			border-radius: 0.5rem;
			border: 1px solid var(--main3);
		}

		div {
			display: flex;
			gap: 1rem;
		}
	}

	form {
		height: calc(100svh - var(--headerHeight) - var(--headerHeight) - (0.618em*5) );
		display: flex;
		flex-direction: column;
	}

	#scheduleDays {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		height: 100%;
		width: 100%;
		gap: 10px;
	}

	#scheduleDays > .dayDiv {
		background-color: var(--offSecondary);
		padding: 0rem 1rem 1rem 1rem;
		width: 350px;
		height: 100%;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		overflow-y: scroll;
		gap: 1rem;

		h1 {
			padding: 1rem 0rem;
			background-color: var(--offSecondary);
			position: sticky;
			top: 0px;
		}
		select {
			width: 100%;
		}

		.flexRow {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: row;
			gap: 1rem;
		}

		div {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		h3 {
			width: 100%;
			text-align: center;
		}

		.add {
			width: 100%;
			font-size: 1rem;
			padding: 1rem;
			text-align: center;
		}
	}

	
</style>
