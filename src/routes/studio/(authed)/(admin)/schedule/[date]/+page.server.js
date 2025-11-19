import { db } from '$lib/db';
import { fetchPrograms } from '$lib/server/programs';
import { getDateSum, secondsToTimeStamp } from '$lib/utils/dates.js';
import { fetchWeeklySchedule } from '$lib/server/schedule.js';
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

    let weeklySchedule = await fetchWeeklySchedule(mondayDate);
    weeklySchedule = await weeklySchedule.map(day => 
            day.map(episode => ({
                programId: episode.episode_program_id,
                episodeNumber: episode.episode_number
            }))
    );
    
    return {
        mondayDate,
        allPrograms,
        weeklySchedule
    };
};

export const actions = {

    submitSchedule: async ({ request }) => {

        const data = await request.formData();
        const mondayDate = data.get('mondayDate');
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
                await db.query('INSERT into schedule (id, startingDate, endingDate) VALUES ($1, $2, $3)', [id ,mondayDate, sundayDate]);
            } catch (err) {
                console.error('Error adding schedule:', err);
            }

        } else {
            id = existingSchedule.rows[0].id;
            console.log('Schedule already exists for this week');
        }

        //insert into episodeSchedule

        const days = JSON.parse(data.get('episodes'));
        const startingHour = data.get('startingHour');

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
    }

};
