import { fetchPublicDaySchedule } from '$lib/server/schedule.js';

export async function load({}) {

    const date = new Date().toISOString().split('T')[0];

    let daySchedule = await fetchPublicDaySchedule(date);

    console.log(daySchedule);
    
    return {
        daySchedule
    };
};