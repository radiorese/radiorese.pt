<script>
    let innerWidth = $state();

    let { daySchedule } = $props();

	let audioPlaying = $state(false);
	let audioElement = $state();

	import PlayIcon from '$lib/icons/play.svg';
	import PauseIcon from '$lib/icons/pause.svg';
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


</script>

<svelte:window bind:innerWidth />

<audio bind:this={audioElement}>
	<source
		src="https://live.radiorese.pt/stream"
		type="audio/mpeg"
	/>
</audio>

<div id="audioPlayer" class="glassMorphic bRadius3 solidBorder {innerWidth < 800 ? "bottom" : ""}" >
    {#if daySchedule != null}
        <header>
                <button class="iconSize2" onclick={toggleAudio}>
                    <img src={audioPlayerIcon} alt="Play" class="iconSize2" />
                </button>
                <div>
                    <h1 class="bold">
                        {daySchedule[0].title}
                    </h1>
                    <h2>
                        {daySchedule[0].programTitle}
                    </h2>
            
                    <h3 class="cMain3">
                        {#each daySchedule[0].curators as curator}
                            {curator}{#if curator != daySchedule[0].curators[daySchedule[0].curators.length - 1]}, {/if}
                        {/each}
                    </h3>
                </div>
        </header>
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
        width: 20rem;
        height: 5rem;
        padding: 0 2rem;

        header{
            display: flex;
            justify-content: left;
            align-items: center;
            gap: 1.5rem;
            height: 100%;

            div{
                overflow: hidden;
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
</style>
