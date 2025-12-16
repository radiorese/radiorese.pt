import { redirect } from '@sveltejs/kit';
import { fetchPublicWeeklySchedule, fetchNextScheduleDate, fetchPreviousScheduleDate } from '$lib/server/schedule.js';

export async function load({ params }) {

    const currentDate = params.date;
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const mondayDate = new Date(date.setDate(diff)).toISOString().split('T')[0];

    let weeklySchedule = await fetchPublicWeeklySchedule(mondayDate);
    let previousScheduleDate = await fetchPreviousScheduleDate(mondayDate, true);
    let nextScheduleDate = await fetchNextScheduleDate(mondayDate, true);
    
    if (weeklySchedule === null) {
        if (nextScheduleDate !== null) {
            redirect(302, `/schedule/${nextScheduleDate}/`);
        } else if (previousScheduleDate !== null) {
            redirect(302, `/schedule/${previousScheduleDate}/`);
        } else {
            redirect(302, '/');
        }
    }
    
    return {
        weeklySchedule,
        mondayDate,
        previousScheduleDate,
        nextScheduleDate
    };
};