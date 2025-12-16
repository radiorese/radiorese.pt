import { db } from '$lib/db';


export const load = async ({}) => {

    let episodes;

    try {
        episodes = await db.query(`
            SELECT e.*, row_to_json(p.*) as program
            FROM episode e
            JOIN program p ON e.program_id = p.id
            WHERE e.isavailablelocally = FALSE
        `);

        console.log('episodes:', episodes.rows);

        episodes = episodes.rows;
        
    } catch (err) {
        console.error('Error loading episodes:', err);
    }

    return {
        episodes
    };
};

export const actions = {

    markDownloads: async ({ request }) => {

        const data = await request.formData();
        const episodes = JSON.parse(data.get('episodes'));

        //insert to db
        try {
            episodes.forEach(async episode => {
                console.log("episode--"+ episode.number + "programId--"+ episode.programId);
                await db.query('UPDATE episode SET isavailablelocally = TRUE WHERE number = $1 AND program_id = $2', [episode.number, episode.programId]);
            });
        } catch (err) {
            return {
                error: 'Erro: ' + err
            };
        }
    },
};