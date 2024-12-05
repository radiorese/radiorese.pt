import { db } from '$lib/db.js';
import { fetchEpisodeByNumber } from './episodes.js';

export async function fetchPrograms() {
    try {
        let programs = await db.query('SELECT * FROM program ORDER BY title');
        programs = programs.rows;

        for (let row of programs) {

            let curators = await db.query(`
                SELECT name 
                FROM member 
                WHERE account_id IN (
                    SELECT member_account_id 
                    FROM program_curator 
                    WHERE program_id = $1
                )
            `, [row.id]);
            row.curators = curators.rows.map(curator => curator.name);

            let creators = await db.query(`
                SELECT name 
                FROM member 
                WHERE account_id IN (
                    SELECT member_account_id 
                    FROM program_creator 
                    WHERE program_id = $1
                )
            `, [row.id]);
            row.creators = creators.rows.map(creator => creator.name);
        }
        return programs;
    } catch (err) {
        console.error('Error loading inactive members:', err);
    }
}

export async function fetchProgramsByAccountId(accountId) {
    try {
        let programs = await db.query(`
            SELECT * 
            FROM program 
            WHERE id IN (
                SELECT program_id 
                FROM program_curator 
                WHERE member_account_id = $1
            )
            OR id IN (
                SELECT program_id 
                FROM program_creator 
                WHERE member_account_id = $1
            )
            OR id IN (
                SELECT episode_program_id
                FROM episode_curator
                WHERE member_account_id = $1
            )
            ORDER BY title
        `, [accountId]);
        programs = programs.rows;

        for (let row of programs) {

            let curators = await db.query(`
                SELECT name 
                FROM member 
                WHERE account_id IN (
                    SELECT member_account_id 
                    FROM program_curator 
                    WHERE program_id = $1
                )
            `, [row.id]);
            row.curators = curators.rows.map(curator => curator.name);

            let creators = await db.query(`
                SELECT name 
                FROM member 
                WHERE account_id IN (
                    SELECT member_account_id 
                    FROM program_creator 
                    WHERE program_id = $1
                )
            `, [row.id]);
            row.creators = creators.rows.map(creator => creator.name);
        }
        return programs;
    } catch (err) {
        console.error('Error loading inactive members:', err);
    }
}

export async function fetchProgramById(programId) {
    try {
        let program = await db.query('SELECT * FROM program WHERE id = $1', [programId]);
        program = program.rows[0];

        let curators = await db.query(`
            SELECT name 
            FROM member 
            WHERE account_id IN (
                SELECT member_account_id 
                FROM program_curator 
                WHERE program_id = $1
            )
        `, [programId]);
        program.curators = curators.rows.map(curator => curator.name);

        let creators = await db.query(`
            SELECT name 
            FROM member 
            WHERE account_id IN (
                SELECT member_account_id 
                FROM program_creator 
                WHERE program_id = $1
            )
        `, [programId]);
        program.creators = creators.rows.map(creator => creator.name);

        let episodes = await db.query(`
            SELECT number 
            FROM episode 
            WHERE program_id = $1
            ORDER BY number
        `, [programId]);
        program.episodes = await Promise.all(
            episodes.rows.map(async (episode) => {
                return await fetchEpisodeByNumber(programId, episode.number);
            })
        );

        return program;
    } catch (err) {
        console.error('Error loading inactive members:', err);
    }
}

export async function isProgramCuratedByUser(userId, programId) {
    try {
        let result = await db.query(`
            SELECT * 
            FROM program_curator 
            WHERE member_account_id = $1 
            AND program_id = $2
        `, [userId, programId]);
        return result.rowCount > 0;
    } catch (err) {
        console.error('Error checking if user is program curator:', err);
    }
}

export async function isProgramCreatedByUser(userId, programId) {
    try {
        let result = await db.query(`
            SELECT * 
            FROM program_creator 
            WHERE member_account_id = $1 
            AND program_id = $2
        `, [userId, programId]);
        return result.rowCount > 0;
    } catch (err) {
        console.error('Error checking if user is program creator:', err);
    }
}

export async function hasUserCuratedAnyEpisodeInProgram(userId, programId) {
    try {
        let result = await db.query(`
            SELECT * 
            FROM episode_curator 
            WHERE member_account_id = $1 
            AND episode_program_id = $2
        `, [userId, programId]);
        return result.rowCount > 0;
    } catch (err) {
        console.error('Error checking if user is curator of one of the episodes:', err);
    }
}