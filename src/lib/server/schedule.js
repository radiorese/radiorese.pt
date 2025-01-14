import { db } from '$lib/db';

export async function fetchWeeklySchedule(mondayDate) {

    let checkIfWeeklySchedule = await db.query('SELECT * FROM schedule WHERE startingdate = $1', [mondayDate]);

    if (checkIfWeeklySchedule.rows.length === 0) {
        return [ [], [], [], [], [], [], []];
    }

    let weeklySchedule = [];

    for (let index = 0; index < 7; index++) {
        let date = new Date(mondayDate);
        date.setDate(date.getDate() + index);
        date = date.toISOString().split('T')[0];
        
        const dailySchedule = await db.query('SELECT * FROM episodeschedule WHERE day = $1 ORDER BY startingtime', [date]);
        weeklySchedule[index] = dailySchedule.rows;
    }
    
    return weeklySchedule;
    
}

export async function fetchPublicWeeklySchedule(monday) {

    let weeklySchedule = await fetchWeeklySchedule(monday);
    const emptySchedule = [[], [], [], [], [], [], []];

    if (weeklySchedule === emptySchedule) {
        return null;
    }

    weeklySchedule = weeklySchedule.map(day => 
        day.map(episode => ({
            programId: episode.episode_program_id,
            episodeNumber: episode.episode_number,
            startingTime: episode.startingtime,
            endingTime: episode.endingtime
        }))
    );

    
    for (const day of weeklySchedule) {
        for (const episode of day) {
            const titleResult = await db.query("SELECT title FROM episode WHERE program_id = $1 AND number = $2", [episode.programId, episode.episodeNumber]);
            episode.title = titleResult.rows[0]?.title || '';
            const curatorsResult = await db.query("SELECT name FROM member WHERE account_id IN (SELECT member_account_id FROM episode_curator WHERE episode_program_id = $1 AND episode_number = $2)", [episode.programId, episode.episodeNumber]);
            episode.curators = curatorsResult.rows.map(row => row.name);
            const mediaTypeResult = await db.query("SELECT mediatype FROM program WHERE id = $1", [episode.programId]);
            episode.mediaType = mediaTypeResult.rows[0]?.mediatype || '';
            const programTitleResult = await db.query("SELECT title FROM program WHERE id = $1", [episode.programId]);
            episode.programTitle = programTitleResult.rows[0]?.title || '';
        }
    }

    return weeklySchedule;

}

export async function fetchPublicDaySchedule(date) {
    const dailySchedule = await db.query('SELECT * FROM episodeschedule WHERE day = $1 ORDER BY startingtime', [date]);
    const dailyScheduleArray = dailySchedule.rows.map(episode => ({
        programId: episode.episode_program_id,
        episodeNumber: episode.episode_number,
        startingTime: episode.startingtime,
        endingTime: episode.endingtime
    }));

    for (const episode of dailyScheduleArray) {
        const titleResult = await db.query("SELECT title FROM episode WHERE program_id = $1 AND number = $2", [episode.programId, episode.episodeNumber]);
        episode.title = titleResult.rows[0]?.title || '';
        const curatorsResult = await db.query("SELECT name FROM member WHERE account_id IN (SELECT member_account_id FROM episode_curator WHERE episode_program_id = $1 AND episode_number = $2)", [episode.programId, episode.episodeNumber]);
        episode.curators = curatorsResult.rows.map(row => row.name);
        const mediaTypeResult = await db.query("SELECT mediatype FROM program WHERE id = $1", [episode.programId]);
        episode.mediaType = mediaTypeResult.rows[0]?.mediatype || '';
        const programTitleResult = await db.query("SELECT title FROM program WHERE id = $1", [episode.programId]);
        episode.programTitle = programTitleResult.rows[0]?.title || '';
    }

    return dailyScheduleArray;
}

export async function fetchNextScheduleDate(monday) {
     const mondayDate = new Date(monday);
     const result = await db.query(
         'SELECT startingdate FROM schedule WHERE startingdate > $1 ORDER BY startingdate ASC LIMIT 1',
         [mondayDate]
     );
     return result.rows.length > 0 ? result.rows[0].startingdate.toISOString().split('T')[0] : null;
}

export async function fetchPreviousScheduleDate(monday) {
    const mondayDate = new Date(monday);
    const result = await db.query(
        'SELECT startingdate FROM schedule WHERE startingdate < $1 ORDER BY startingdate DESC LIMIT 1',
        [mondayDate]
    );
    return result.rows.length > 0 ? result.rows[0].startingdate.toISOString().split('T')[0] : null;
}