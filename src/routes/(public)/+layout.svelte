<script>
    import logoFooterWide from '$lib/assets/logoFooterWide.svg';
    import logoFooterNarrow from '$lib/assets/logoFooterNarrow.svg';

    import logo from '$lib/assets/logo.png';
	import { goto } from '$app/navigation';

    import AudioPlayer from './audioPlayer.svelte';

    let innerWidth = $state();
    let scrollY = $state();

    let currentDate = new Date().toISOString().split('T')[0];

    let { data } = $props();

    let daySchedule = $state(data.daySchedule);
    let dayScheduleSkimmed = $state([]);

    filterDaySchedule();
    

	import { onMount } from 'svelte';

    function filterDaySchedule() {
        const currentTime = new Date();

        dayScheduleSkimmed = daySchedule.filter(episode => {
        const [startHour, startMinutes, startSeconds] = episode.startingTime.split(':').map(Number);
        const [endHour, endMinutes, endSeconds] = episode.endingTime.split(':').map(Number);

        const startTime = new Date();
        startTime.setHours(startHour, startMinutes, startSeconds);

        const endTime = new Date();
        endTime.setHours(endHour, endMinutes, endSeconds);

        return endTime >= currentTime;
        });

        if (daySchedule.length === 0) {
        dayScheduleSkimmed = [];
        }
    }

    onMount(() => {
        filterDaySchedule();
        const interval = setInterval(filterDaySchedule, 3000);
        return () => clearInterval(interval);
    });
</script>

<svelte:window bind:innerWidth bind:scrollY />

<!-- Header -->
<nav class={scrollY > 0 ? "scrolled" : ""}>
    <button onclick={() => goto("/")}><img src={logo} alt="Logo" class="iconSize3" /></button>
    <div>
        <button onclick={() => goto("/")}>Index</button>
        <button onclick={() => goto("/schedule/" + currentDate)}>Horário</button>
    </div>
</nav>


<main>
    <slot></slot>
</main>

<!-- Audio Player -->
<AudioPlayer daySchedule={dayScheduleSkimmed.length != 0 ? dayScheduleSkimmed : null}/>

<!-- Footer -->
<footer>
    <img src={innerWidth < 740 ? logoFooterNarrow : logoFooterWide} alt="Logo" class="logo-wide" />

    <div id="footerContent">
        <div>
            <a href="https://maps.app.goo.gl/ouRKBm4CrsW9v87P9" class="underlined">Google Maps</a>
            <a href="mailto:radioescolasuperioreducacao@gmail.com" class="underlined">Email</a>
            <a href="https://www.instagram.com/radiorese.pt?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" class="underlined">Instagram</a>
            <a href="https://github.com/radiorese" class="underlined">Github</a>
        </div>

        <p id="credits">Website desenhado <br> e desenvolvido <br> por <a class="underlined">Rafa Silva Arias</a></p>
    </div>
</footer>

<style>

    :global(body) {
        margin: 0px;
    }

    nav{

        z-index: 5;
        position: fixed;
        top: 0px;
        width: 100%;
        padding: 0px var(--globalMargin, 0px);

        height: var(--headerHeight);
        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: rgba(0,0,0,0);
        transition: background-color 0.5s;

        img{
            rotate: 0;
            animation: rotate 5s linear infinite;
        }

        div{
            display:flex;
            gap: 1rem;
        }

        

    }

    .scrolled{
        background-color: var(--secondary);
    }


    main {
        min-height: 100svh;
    }

    footer{
        position:relative;

        img {
            position: relative;
            width: 100%;
            bottom:-4px;
            overflow: hidden;
        }   

        #footerContent{

            padding: 0px var(--globalMargin, 0px);
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 5rem;

            div{

                display: flex;
                flex-direction: column;
                align-items: left;
                justify-content: center;
                gap: 1rem;

            }

            #credits{
                text-align: right;
            }

        }

        @media (max-width: 740px) {
            #footerContent{
                flex-direction: column;
                justify-content: space-around;

                div{
                    align-items: center;
                }

                #credits{
                    text-align: center;
                }
            }
        }

    }

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-360deg);
        }
    }

    
</style>