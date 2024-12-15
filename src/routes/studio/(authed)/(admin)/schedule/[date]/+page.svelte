<script>
	let { data } = $props();
	let currentDate = data.currentDate;
	let mondayDate = data.mondayDate;

	import undoIcon from '$lib/icons/undo.svg';
	import forwardIcon from '$lib/icons/redo.svg';

	import copyIcon from '$lib/icons/copy.svg';
	import deleteIcon from '$lib/icons/delete.svg';

	let months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

	let startingHour = $state(10);

	let days = [
		{
			name: 'Segunda',
			collapsed: false,
			episodes: []
		},
		{
			name: 'Terça',
			collapsed: false,
			episodes: []
		},
		{
			name: 'Quarta',
			collapsed: false,
			episodes: []
		},
		{
			name: 'Quinta',
			collapsed: false,
			episodes: []
		},
		{
			name: 'Sexta',
			collapsed: false,
			episodes: []
		},
		{
			name: 'Sábado',
			collapsed: false,
			episodes: []
		},
		{
			name: 'Domingo',
			collapsed: false,
			episodes: []
		}
	];

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

	function formatDateRange(day) {
		const date = new Date(day);
		const formattedDate = `${date.getDate()}${months[date.getMonth()]}`;
		return formattedDate;
	}

	function isToday(date) {
		const today = new Date();
		const checkDate = new Date(date); // Ensure date is a Date object
		return (
			checkDate.getDate() === today.getDate() &&
			checkDate.getMonth() === today.getMonth() &&
			checkDate.getFullYear() === today.getFullYear()
		);
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
			</h2>
		</div>
		<button onclick={goToNextWeek} aria-label="Next Week">
			<image src={forwardIcon} alt="Next Week" class="iconSize1" />
		</button>
	</div>

	<!--global control section-->
	<div id="middleBanner" class="bRadius1 mBottom-xxl">
		<div>
			<label for="startingHour">
				<h3>Hora de Início:</h3>
				<input bind:value={startingHour} type="number" />
				<p>Horas</p>
			</label>
		</div>
		<div id="buttons">
			<button id="copyButton" class="bRadius1">
				<img src={copyIcon} alt="Copy" class="iconSize1" />
			</button>
			<button id="deleteButton" class="bRadius1">
				<img src={deleteIcon} alt="Delete" class="iconSize1" />
			</button>
		</div>
	</div>

	<!--Schedule Days Section-->

	<div id="scheduleDays" class="bRadius1">
		{#each days as day, index}
			<div class="dayDiv">
				<h1 class="tSize2">
					{day.name}
					{formatDateRange(new Date(mondayDate).setDate(new Date(mondayDate).getDate() + index))}
					{#if isToday(new Date(mondayDate).setDate(new Date(mondayDate).getDate() + index))}
						(Hoje)
					{/if}
				</h1>
			</div>
		{/each}
	</div>
</main>

<style>
	main{
		height: calc(100svh - var(--headerHeight) - var(--globalMargin));
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

		div > label {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			> input {
				width: 3rem;
				padding: 0.5rem;
				border-radius: 0.5rem;
				border: 1px solid var(--main3);
			}
		}
		#buttons {
			display: flex;
			gap: 0.5rem;
			#copyButton {
				width: 2.5rem;
				height: 2.5rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: var(--secondary);
			}
			#deleteButton {
				width: 2.5rem;
				height: 2.5rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: var(--red);
			}
		}
	}

	#scheduleDays {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		height: 100%;
		width: 100%;
	}

	#scheduleDays > .dayDiv {
		background-color: var(--offSecondary);
		padding: 1rem;
		width: 300px;
		height: 100%;
		display: inline-block;
		margin-right: 10px;
		flex-shrink: 0;
	}
</style>
