<script>
	import { getDateSum, formatDate, getRelativeWeekString } from '$lib/utils/dates.js';

    import undoIcon from '$lib/icons/undo.svg';
	import forwardIcon from '$lib/icons/redo.svg';

	let { data } = $props();
	let weeklySchedule = data.weeklySchedule;

    let weekTitle = getRelativeWeekString(data.mondayDate);

	let days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

	let mondayDate = data.mondayDate; 

    let previousWeek = data.previousScheduleDate;
    let nextWeek = data.nextScheduleDate;

    function goToPreviousWeek() {
		window.location.href = `/schedule/${previousWeek}`;
	}

	function goToNextWeek() {
		window.location.href = `/schedule/${nextWeek}`;
	}

    let innerWidth = $state();

    console.log("previousWeek", data.previousScheduleDate);
</script>

<svelte:window bind:innerWidth />

<main>

    <!-- Schedule Title and Controls -->
    <div id="controls">
        {#if previousWeek}
            <button onclick={goToPreviousWeek} aria-label="Previous Week">
                <image src={undoIcon} alt="Previous Week" class="iconSize1" />
            </button>
        {/if}
        <div>
            <h1 class="tSize4 mBottom-s">{weekTitle}
                <hr class="underline" />
            </h1>
            <h2 class="cMain3 tSize2">{formatDate(mondayDate)} - {formatDate(getDateSum(mondayDate, 6))}</h2>
        </div>
        {#if nextWeek}
            <button onclick={goToNextWeek} aria-label="Next Week">
                <image src={forwardIcon} alt="Next Week" class="iconSize1" />
            </button>
        {/if}
    </div>


    <!-- Week Schedule-->
    <div id="schedule" class="mBottom-xxxl">
        {#each weeklySchedule as day, dayIndex}
            {#if day.length > 0 }
                <div class="dayDiv mTop-xl">
                    <div>
                        <h1 class="tSize3 dayTitle">{days[dayIndex]}</h1>
                        <h2 class="cMain3 tSize3">{formatDate(getDateSum(mondayDate, dayIndex))}</h2>
                    </div>
                    {#each day as episode}
                        <div class="episodeDiv solidBorder bRadius1">
                            {#if episode.debut}
                                <h4 class="debutText bgBlue">ESTREIA</h4>
                            {/if}
                            <h3 class="cMain3 mBottom-s">
                                {#if episode.mediaType == 'music'}
                                    <b class="cRed">Música</b>
                                {:else if episode.mediaType == 'podcast'}
                                    <b class="cYellow">Podcast</b>
                                {/if}
                                · {episode.startingTime.split(':')[0]}h{episode.startingTime.split(':')[1]}
                            </h3>
                            <h1 class="bold"> {episode.title} <b class="cMain3">#{episode.episodeNumber}</b></h1>
                            <h2>{episode.programTitle}</h2>
                            
                            <h3 class="cMain3">
                                {#each episode.curators as curator, index}
                                    {curator}{index < episode.curators.length - 1 ? ', ' : ''}
                                {/each}
                            </h3>
                        </div>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
</main>

<style>
	main {
		margin: var(--headerHeight) var(--globalMargin, 0px) var(--globalMargin, 0px) var(--globalMargin, 0px);
	}

    #schedule{
        display: flex;
        flex-direction: row;
        gap: 2rem;

        .dayDiv {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
            width: 100%;

			.episodeDiv {
				display: flex;
				flex-direction: column;
				gap: 0.3rem;
                padding: 1rem;
                border-color: var(--main4);
                position: relative;

                .debutText {
                    position: absolute;
                    top: -0.5rem;
                    right: -0.5rem;
                    padding: 0.2rem 0.5rem;
                    border-radius: 0.5rem;
                }
			}
		}
    }

    #controls {
        width: 100%;
        display: flex;
        gap:2rem;
        justify-content: center;
        align-items: center;
        padding: 2rem 0 1rem 0;

        div{
            position:relative;

            h1, h2 {
                text-align: center;
            }

            .underline {
                position: absolute;
                width: 100%;
                top:32%;
                rotate: 1.2deg;
                border: 3px solid var(--orange);
                color: var(--orange);
            }
        }
    }

    @media (max-width: 800px) {
        #schedule {
            flex-wrap: wrap;
        }
    }

    
</style>
