<script>
    let innerWidth = $state();

    let { daySchedule } = $props();

    console.log(daySchedule);

	let audioPlaying = $state(false);
	let audioElement = $state();

	import PlayIcon from '$lib/icons/play.svg';
	import PauseIcon from '$lib/icons/pause.svg';
    import UpIcon from '$lib/icons/up.svg';
    import DownIcon from '$lib/icons/down.svg';
	import { onMount } from 'svelte';
	let audioPlayerIcon = $derived(audioPlaying ? PauseIcon : PlayIcon);

	let audioPlayerClosed = $state(true);

	$effect(() => {
		if (audioPlaying) {
			audioElement.play();
		} else {
			audioElement.pause();
		}
	});

	function toggleAudio() {
		audioPlaying = !audioPlaying;
	}

    let sliderContainerWidth = $state();
    let infoWidth = $state([]);
    let infoOffset = $state([]);
    let frame = 0;

    onMount(() => {
        
        const interval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                infoOffset[i] = ((sliderContainerWidth - infoWidth[i]) * ((Math.cos(frame/360))) - (sliderContainerWidth - infoWidth[i])) / 2;
            }
            frame++;
        }, 5);
    });


</script>

<svelte:window bind:innerWidth />

<audio bind:this={audioElement}>
	<source
		src="https://live.radiorese.pt/stream"
		type="audio/mpeg"
	/>
</audio>

<div id="audioPlayer" class="glassMorphic solidBorder {innerWidth < 800 ? "bottom" : ""} {audioPlayerClosed ? "" : "open"}" >
    {#if daySchedule != null}
        <header>
                    <button class="iconSize2" onclick={toggleAudio}>
                        <img src={audioPlayerIcon} alt="Play" class="iconSize2" />
                    </button>
                    {#if audioPlayerClosed}
                        <div id="audioInfo" bind:clientWidth={sliderContainerWidth}>

                            <div class="sliderContainer">
                                <h1 
                                    class="bold" 
                                    bind:clientWidth={infoWidth[0]}
                                    style="left: {-infoOffset[0]}px;"
                                >
                                    {daySchedule[0].title} <b class="cMain3">#{daySchedule[0].episodeNumber}</b>
                                </h1>
                            </div>
                            <div class="sliderContainer">
                                <h2 
                                    bind:clientWidth={infoWidth[1]}
                                    style="left: {-infoOffset[1]}px;"
                                >
                                    {daySchedule[0].programTitle}
                                </h2>
                            </div>
                            <div class="sliderContainer">
                                <h3 
                                    class="cMain3" 
                                    bind:clientWidth={infoWidth[2]}
                                    style="left: {-infoOffset[2]}px;"
                                >
                                    {#each daySchedule[0].curators as curator}
                                        {curator}{#if curator != daySchedule[0].curators[daySchedule[0].curators.length - 1]}, <b></b>{/if}
                                    {/each}
                                </h3>
                            </div>

                        </div>
                    {/if}
                    <button class="iconSize1" onclick={() => audioPlayerClosed = !audioPlayerClosed}>
                        <img src={audioPlayerClosed ? UpIcon : DownIcon} alt="Open/Close" class="iconSize1" />
                    </button>
        </header>
        {#if !audioPlayerClosed}
            <div>

                <div>
                    <h3 class="cMain3 mBottom-s">
                        {#if daySchedule[0].mediaType == 'music'}
                            <b class="cRed">Música</b>
                        {:else if daySchedule[0].mediaType == 'podcast'}
                            <b class="cYellow">Podcast</b>
                        {/if}
                        · Agora
                    </h3>
                    <h1 class="tSize2 bold">{daySchedule[0].title} <b class="tSize1 cMain3">#{daySchedule[0].episodeNumber}</b></h1>
                    <h2 class="tSize2 mBottom-m">{daySchedule[0].programTitle}</h2>
                    <h3 class="tSize1 cMain3">
                        {#each daySchedule[0].curators as curator}
                            {curator}{#if curator != daySchedule[0].curators[daySchedule[0].curators.length - 1]}, <b></b>{/if}
                        {/each}
                    </h3>
                </div>

                {#if daySchedule[1]}
                    <div class="divider">
                        <hr>
                        <p class="cMain5">A Seguir</p>
                        <hr>
                    </div>
                {/if}

                {#each daySchedule.slice(1) as schedule}
                    <div>
                        <h3 class="cMain3 mBottom-s">
                            {#if schedule.mediaType == 'music'}
                                <b class="cRed">Música</b>
                            {:else if schedule.mediaType == 'podcast'}
                                <b class="cYellow">Podcast</b>
                            {/if}
                            · {schedule.startingTime.split(':')[0]}h{schedule.startingTime.split(':')[1]}
                        </h3>
                        <h1 class="tSize1 bold">{schedule.title} <b class="tSize1 cMain3">#{schedule.episodeNumber}</b></h1>
                        <h2 class="tSize1">{schedule.programTitle}</h2>
                        <h3 class="tSize1 cMain3">
                            {#each schedule.curators as curator}
                                {curator}{#if curator != schedule.curators[schedule.curators.length - 1]}, <b></b>{/if}
                            {/each}
                        </h3>
                    </div>
                {/each}

                <p class="mBottom-xxl cMain3">Vê o resto do horário <a class="underlined cMain3" href="/schedule/">aqui</a></p>

            </div>
        {/if}
    {:else}
        <header class="offline">
            <h1 class="tSize2">
                <b>☠ </b>  Estamos Offline  <b> ☠</b>
            </h1>
        </header>
    {/if}
</div>

<style>
	#audioPlayer {
        position: fixed;
        z-index: 2;
        bottom: var(--globalMargin);
        right: var(--globalMargin);
        width: 22rem;
        height: 5rem;
        border-radius: 2.5rem;
        padding: 0 2rem;
        transition: height 0.5s;

        ::-webkit-scrollbar {
            display: none;
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }

        

        header{
            position: sticky;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1.5rem;
            height: 5rem;

            #audioInfo {
                overflow: hidden;
                width: 100%;

                .sliderContainer {
                    position: relative;

                    h1, h2, h3 {
                        position: relative;
                        width: fit-content;
                        min-width: 100%;
                    }
                }



                * {
                    white-space: nowrap;
                }
            }
        }

        header.offline{
            justify-content: center;
        }
    }

    #audioPlayer.bottom {
        bottom: -1px;
        left:-1px;
        width: calc(100% + 2px);
        padding: 0 2rem;
        border-radius: 2.5rem 2.5rem 0 0;
        border-bottom: none;
    }

    #audioPlayer.open {
        height: calc(100svh - var(--doubleGlobalMargin) - var(--headerHeight));
        
        

        > div {

            display: flex;
            flex-direction: column;
            justify-content: left;
            gap: 2rem;
            height: calc(100% - 5rem);
            overflow-y: scroll;
            
            .divider {

                p {
                    white-space: nowrap;
                }

                hr {
                    width: 100%;
                    margin: 0;
                }

                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;
            }

            p {
                text-align: center;
            }

        }   
    }

    #audioPlayer.open.bottom {
        height: calc(100svh - var(--headerHeight));
    }
    
</style>
