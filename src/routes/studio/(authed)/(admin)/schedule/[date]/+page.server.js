import { db } from '$lib/db';
import { fetchPrograms } from '$lib/server/programs';
import { getDateSum, secondsToTimeStamp } from '$lib/utils/dates.js';
import { fetchWeeklySchedule, fetchAllScheduleDates } from '$lib/server/schedule.js';
import { fetchEpisodeDuration } from '$lib/server/episodes.js';

export async function load({ params }) {

    const currentDate = params.date;
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const mondayDate = new Date(date.setDate(diff)).toISOString().split('T')[0];

    console.log('mondayDate:', mondayDate);

    const allPrograms = await fetchPrograms();

    for (const program of allPrograms) {
        let totalAppearances = 0;
        let maxAppearances = 0;
        let minAppearances = Infinity;
        
        for (const episode of program.episodes) {
            const previousAppearances = await db.query(`
                SELECT COUNT(*) 
                FROM episodeschedule 
                WHERE episode_program_id = $1 
                AND episode_number = $2 
                AND day < $3
            `, [program.id, episode.number, mondayDate]);
            episode.previousAppearances = parseInt(previousAppearances.rows[0]?.count || 0);
            
            totalAppearances += episode.previousAppearances;
            
            if (episode.previousAppearances > maxAppearances) {
                maxAppearances = episode.previousAppearances;
            }
            
            if (episode.previousAppearances < minAppearances) {
                minAppearances = episode.previousAppearances;
            }
        }
        
        program.avgAppearances = program.episodes.length > 0 
            ? totalAppearances / program.episodes.length 
            : 0;
        program.maxAppearances = maxAppearances;
        program.minAppearances = program.episodes.length > 0 ? minAppearances : 0;
    }

    let weeklyScheduleData = await fetchWeeklySchedule(mondayDate);
    let weeklySchedule = weeklyScheduleData.schedule.map(day => 
            day.map(episode => ({
                programId: episode.episode_program_id,
                episodeNumber: episode.episode_number
            }))
    );

    // Calculate starting hour from the earliest episode across all days
    let startingHour = null;
    for (let daySchedule of weeklyScheduleData.schedule) {
        if (daySchedule && daySchedule.length > 0) {
            const earliestTime = daySchedule[0].startingtime; // Already ordered by startingtime
            if (earliestTime) {
                // Parse time format (HH:MM:SS) to extract hour
                const hourMatch = earliestTime.match(/^(\d{2})/);
                if (hourMatch) {
                    const hour = parseInt(hourMatch[1]);
                    if (startingHour === null || hour < startingHour) {
                        startingHour = hour;
                    }
                }
            }
        }
    }
    // Default to 8 if no episodes found
    if (startingHour === null) {
        startingHour = 8;
    }

    let scheduleDates = await fetchAllScheduleDates();
    
    return {
        mondayDate,
        allPrograms,
        weeklySchedule,
        scheduleDates,
        isPublic: weeklyScheduleData.isPublic,
        startingHour: startingHour
    };
};

// Helper function to save schedule (reusable)
async function saveScheduleData(mondayDate, episodes, startingHour) {
    const sundayDate = getDateSum(mondayDate, 6);
    let id;

    const existingSchedule = await db.query('SELECT * FROM schedule WHERE startingDate = $1 OR endingDate = $2', [mondayDate, sundayDate]);

    //insert into schedule
    if (! existingSchedule.rows.length > 0) {

        let highestId = await db.query('SELECT MAX(id) FROM schedule');
        highestId = highestId.rows[0].max || 0;
        id = highestId + 1;

        console.log('id:', id, 'monday:', mondayDate, 'sunday:', sundayDate);

        try{
            await db.query('INSERT into schedule (id, startingDate, endingDate, ispublic) VALUES ($1, $2, $3, $4)', [id ,mondayDate, sundayDate, false]);
        } catch (err) {
            console.error('Error adding schedule:', err);
        }

    } else {
        id = existingSchedule.rows[0].id;
        console.log('Schedule already exists for this week');
    }

    //insert into episodeSchedule

    const days = JSON.parse(episodes);

    db.query('DELETE FROM episodeschedule WHERE schedule_id = $1', [id]);

    days.forEach(async (episodes, index) => {

        const day = getDateSum(mondayDate, index);
        let duration = startingHour * 60 * 60;

        for (const episode of episodes) {

            const startingTime = secondsToTimeStamp(duration);
            const programId = episode.programId;
            const episodeNumber = episode.episodeNumber;
            const episodeDuration = await fetchEpisodeDuration(programId, episodeNumber);
            duration += episodeDuration;
            console.log('ending time:', duration);
            const endingTime = secondsToTimeStamp(duration);

            try {
                await db.query('INSERT INTO episodeschedule (day, startingtime, endingtime, episode_program_id, episode_number, schedule_id) VALUES ($1, $2, $3, $4, $5, $6)', [day, startingTime, endingTime, programId, episodeNumber, id]);
            } catch (err) {
                console.error('Error adding episode:', err);
            }
        };
    });

    return id;
}

export const actions = {

    saveSchedule: async ({ request }) => {
        const data = await request.formData();
        const mondayDate = data.get('mondayDate');
        const episodes = data.get('episodes');
        const startingHour = data.get('startingHour');

        await saveScheduleData(mondayDate, episodes, startingHour);
    },

    publishSchedule: async ({ request }) => {
        const data = await request.formData();
        const mondayDate = data.get('mondayDate');
        const episodes = data.get('episodes');
        const startingHour = data.get('startingHour');
        const sundayDate = getDateSum(mondayDate, 6);

        // First save the schedule
        await saveScheduleData(mondayDate, episodes, startingHour);

        // Then publish it
        try {
            await db.query(
                'UPDATE schedule SET ispublic = true WHERE startingDate = $1 OR endingDate = $2',
                [mondayDate, sundayDate]
            );
            console.log('Schedule published successfully');
        } catch (err) {
            console.error('Error publishing schedule:', err);
        }
    },

    unpublishSchedule: async ({ request }) => {
        const data = await request.formData();
        const mondayDate = data.get('mondayDate');
        const episodes = data.get('episodes');
        const startingHour = data.get('startingHour');
        const sundayDate = getDateSum(mondayDate, 6);

        // First save the schedule
        await saveScheduleData(mondayDate, episodes, startingHour);

        // Then unpublish it
        try {
            await db.query(
                'UPDATE schedule SET ispublic = false WHERE startingDate = $1 OR endingDate = $2',
                [mondayDate, sundayDate]
            );
            console.log('Schedule unpublished successfully');
        } catch (err) {
            console.error('Error unpublishing schedule:', err);
        }
    },

    deleteSchedule: async ({ request }) => {
        const data = await request.formData();
        const mondayDate = data.get('mondayDate');
        const sundayDate = getDateSum(mondayDate, 6);
        const existingSchedule = await db.query('SELECT * FROM schedule WHERE startingDate = $1 OR endingDate = $2', [mondayDate, sundayDate]);
        if (existingSchedule.rows.length > 0) {
            const id = existingSchedule.rows[0].id;
            try {
                await db.query('DELETE FROM episodeschedule WHERE schedule_id = $1', [id]);
                await db.query('DELETE FROM schedule WHERE id = $1', [id]);
                console.log('Schedule deleted successfully');
            } catch (err) {
                console.error('Error deleting schedule:', err);
            }
        } else {
            console.log('No schedule found for this week to delete');
        }
    }

};
