import { db } from '$lib/db';
import { fetchAllEpisodes } from "$lib/server/episodes";

export const load = async ({}) => {

    const episodes = await fetchAllEpisodes();

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

    unMarkDownloads: async ({ request }) => {

        const data = await request.formData();
        const episodes = JSON.parse(data.get('episodes'));

        //insert to db
        try {
            episodes.forEach(async episode => {
                console.log("episode--"+ episode.number + "programId--"+ episode.programId);
                await db.query('UPDATE episode SET isavailablelocally = FALSE WHERE number = $1 AND program_id = $2', [episode.number, episode.programId]);
            });
        } catch (err) {
            return {
                error: 'Erro: ' + err
            };
        }
    }
};