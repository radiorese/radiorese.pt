<script>
	import { formatDate, isToday, isThisWeek } from '$lib/utils/dates.js';
	import { Select, DropdownMenu } from 'bits-ui';
	import selectIcon from '$lib/icons/select.svg';
	import checkIcon from '$lib/icons/check.svg';
	import threeDotsIcon from '$lib/icons/threeDots.svg';
	import pasteIcon from '$lib/icons/paste.svg';
	import copyIcon from '$lib/icons/copy.svg';
	import deleteIcon from '$lib/icons/delete.svg';
	import clockIcon from '$lib/icons/clock.svg';

	let { data } = $props();
	let mondayDate = data.mondayDate;
	let thisWeek = isThisWeek(mondayDate, new Date(mondayDate).setDate(new Date(mondayDate).getDate() + 6));
	let programs = data.allPrograms;
	let scheduleDates = data.scheduleDates;
	let isPublic = $state(data.isPublic);

	import undoIcon from '$lib/icons/undo.svg';
	import forwardIcon from '$lib/icons/redo.svg';

	let episodes = $state(data.weeklySchedule);
	let dailyNumberOfEpisodes = $state(episodes.map(day => day.length));

	let startingHour = $state(data.startingHour || 8);
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
	<div id="titleGroup" class="mBottom-xl">
		<h1 class="tSize3">Horário <b class=" tSize3 hideOnMobile">Semanal</b></h1>
		<div id="weekSelection">
			<button onclick={goToPreviousWeek} aria-label="Previous Week" class="iconSize1">
				<img src={undoIcon} alt="Previous Week" class="iconSize1" />
			</button>
			<Select.Root
				type="single"
				onValueChange={async (e) => {open=false; window.location.href = `/studio/schedule/${e}`;}}
			>
				<Select.Trigger
					style="min-width: 12rem; max-height: 2.5rem;"
					aria-label={thisWeek ? 'Semana Atual' : formatDate(new Date(mondayDate))}
				>
					<p>{formatDate(new Date(mondayDate))} - {formatDate(new Date(new Date(mondayDate).setDate(new Date(mondayDate).getDate() + 6)))}</p>
					<image src={selectIcon} alt="Select Icon" class="iconSize1" />

				</Select.Trigger>
				<Select.Portal>
					<Select.Content>
					<Select.Viewport>
						{#each scheduleDates as date}
							{@const startingDateStr = new Date(date.startingdate.getTime() - date.startingdate.getTimezoneOffset() * 60000).toISOString().split('T')[0]}
							<Select.Item
								value={startingDateStr}
								class="spaceBetween"
							>
								<p>{formatDate(date.startingdate)} - {formatDate(date.endingdate)}</p>
								{#if startingDateStr === mondayDate}
									<img src={checkIcon} alt="Current Week" class="iconSize0" />
								{/if}
							</Select.Item>
						{/each}
					</Select.Viewport>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
			<button onclick={goToNextWeek} aria-label="Next Week" class="iconSize1">
				<img src={forwardIcon} alt="Next Week" class="iconSize1" />
			</button>
		</div>
	</div>


	<form method="POST">
		<!--toolbar section-->
		<div id="toolBar" class="mBottom-xl spaceBetween">
			<div class="flexRow">
				<div class="concatenatedInput hideOnMobile">
					<label for="startingHour"><p>Hora de Começo:</p></label>
					<input type="number" id="startingHour" name="startingHour" bind:value={startingHour} min="0" max="23" />
				</div>
				<p class="cMain3 mRight-m mLeft-s hideOnDesktop">
					<b class="{isPublic ? 'cGreen' : 'cRed'} bold">· </b> 
					{isPublic ? 'Público' : 'Não publicado'}
				</p>
			</div>
			<div class="flexRow">
				<p class="cMain3 mRight-m mLeft-xl hideOnMobile">
					<b class="{isPublic ? 'cGreen' : 'cRed'} bold">· </b> 
					{isPublic ? 'Público' : 'Não publicado'}
				</p>
				
				<button type="submit" formaction="?/saveSchedule" class="strokeButton">Guardar</button>
				<button 
					type="submit" 
					formaction={isPublic ? "?/unpublishSchedule" : "?/publishSchedule"}
					class="whiteButton"
				>
					{isPublic ? 'Despublicar' : 'Publicar'}
				</button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger aria-label="Menu">
						<img src={threeDotsIcon} alt="Menu" class="iconSize2" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content>
							<DropdownMenu.Item
								class="dropdownItem hideOnDesktop"
								onclick={() => {
									const newHour = prompt('Hora de Começo (0-23):', startingHour);
									if (newHour !== null && newHour >= 0 && newHour <= 23) {
										startingHour = parseInt(newHour);
									}
								}}
							>
								<img src={clockIcon} alt="Clock" class="iconSize1 mRight-m" />
								<p>Hora de Começo</p>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class="dropdownItem"
								onclick={(e) => {
									navigator.clipboard.writeText(JSON.stringify(episodes));
								}}
							>
								<img src={copyIcon} alt="Copy Schedule" class="iconSize1 mRight-m" />
								<p>Copiar Horário</p>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class="dropdownItem"
								onclick={() => {
									pasteEpisodes(JSON.parse(prompt('Colar')));
								}}
							>
								<img src={pasteIcon} alt="Paste Schedule" class="iconSize1 mRight-m" />
								<p>Colar Horário</p>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class="dropdownItem"
								onSelect={() => {
									if (confirm('Tem certeza que deseja eliminar este horário?')) {
										const form = document.querySelector('form');
										const submitButton = document.createElement('button');
										submitButton.type = 'submit';
										submitButton.formAction = '?/deleteSchedule';
										submitButton.style.display = 'none';
										form.appendChild(submitButton);
										submitButton.click();
									}
								}}
							>	
								<img src={deleteIcon} alt="Delete Schedule" class="iconSize1 mRight-m" />
								<p>Eliminar Horário</p>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
			</DropdownMenu.Root>
			</div>
		</div>

		<!--schedule days section-->
		<div id="scheduleDays" class="">

			<input type="hidden" name="episodes" value={JSON.stringify(episodes)} />
			<input type="hidden" name="mondayDate" value={mondayDate} />

			{#each days as day, dayIndex}
				<div class="dayDiv bRadius1">
					<!--Title-->
					<h1 class="tSize2">
						{day.name}

						<b class="cMain3 tSize2">
							{formatDate(
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
											episodeNumber: null,
										};
									}}
								>
									<option value="" disabled selected>Programa</option>
									{#each programs as program}
										<option 
											id={"d"+dayIndex+"i"+episodeIndex+"p"+program.id}
											value={program.id}
											selected={episodes[dayIndex][episodeIndex]?.programId == program.id}
										> 
											{(() => {
												const t = program.title ?? '';
												if (t.length <= 35) return t;
												let sub = t.slice(0, 30);
												const idx = sub.lastIndexOf(' ');
												if (idx > 0) sub = sub.slice(0, idx);
												return sub + '...';
											})()}
											[{Number(program.avgAppearances ?? 0).toFixed(1)}] 
										</option>
									{/each}
								</select>
							

							
								{#if episodes[dayIndex][episodeIndex]?.programId}
									<select	
										required
										onchange={(event) => {
											episodes[dayIndex][episodeIndex].episodeNumber = event.target.value;
										}
										}
									>
										<option value="" disabled 
											selected={!episodes[dayIndex][episodeIndex]?.episodeNumber}
										>Episódio</option>
										{#each programs.find(p => p.id == episodes[dayIndex][episodeIndex].programId).episodes as ep}
											{@const program = programs.find(p => p.id == episodes[dayIndex][episodeIndex].programId)}
											<option
												id={"d"+dayIndex+"i"+episodeIndex+"p"+ep.program_id+"e"+ep.number}
												value={ep.number}
												selected={ep.number == episodes[dayIndex][episodeIndex]?.episodeNumber}
												style="background-color: 
													{ep.previousAppearances == 0 ? 'var(--blue)' 
													: `hsl(0, 0%, ${25 - Math.cbrt((ep.previousAppearances - program.minAppearances) / (program.maxAppearances - program.minAppearances)) * 15}%)`}
												"
											>
												{#if ep.previousAppearances == 0}
													[NOVO]
												{:else}
													[{ep.previousAppearances}]
												{/if}
													#{ep.number} 
													{ep.title}
												
											</option>
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

	#titleGroup {
		display: flex;
		justify-content: left;
		gap: 1rem;
		align-items: center;
		#weekSelection {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}

	#toolBar {
		
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
