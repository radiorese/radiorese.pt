import { db } from '$lib/db.js';

export async function fetchEpisodeByNumber(programId, episodeNumber) {
    try {
        let episode = await db.query('SELECT * FROM episode WHERE program_id = $1 AND number = $2', [programId, episodeNumber]);
        episode = episode.rows[0];

        let curators = await db.query(`
            SELECT name 
            FROM member 
            WHERE account_id IN (
                SELECT member_account_id 
                FROM episode_curator 
                WHERE episode_number = $1 AND episode_program_id = $2
            )
        `, [episodeNumber, programId]);
        episode.curators = curators.rows.map(curator => curator.name);

        return episode;
        
    } catch (err) {
        console.error('Error loading episodeById:', err);
    }
}

export async function fetchAllEpisodes() {
    try {
        let episodes = await db.query(`
            SELECT e.*, row_to_json(p.*) as program
            FROM episode e
            JOIN program p ON e.program_id = p.id
        `);

        console.log('episodes:', episodes.rows);

        return episodes.rows;
        
    } catch (err) {
        console.error('Error loading episodes:', err);
    }
}

export async function isEpisodeCuratedByUser(userId, programId, episodeNumber) {
    try {
        let result = await db.query('SELECT * FROM episode_curator WHERE member_account_id = $1 AND episode_program_id = $2 AND episode_number = $3', [userId, programId, episodeNumber]);
        return result.rowCount > 0;
        
    } catch (err) {
        console.error('Error loading episodeById:', err);
    }
}