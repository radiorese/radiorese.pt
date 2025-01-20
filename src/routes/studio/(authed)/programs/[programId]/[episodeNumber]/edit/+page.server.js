import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { fetchMemberById , fetchAllMembers } from '$lib/server/members';
import { isProgramCuratedByUser , fetchProgramById } from '$lib/server/programs.js';
import { fetchEpisodeByNumber , isEpisodeCuratedByUser } from '$lib/server/episodes.js';


export async function load({ params, locals }) {

    const { programId, episodeNumber } = params;
    let user = locals.user;
    const userId = user.id;

    const isAdmin = locals.user.isAdmin;
    const isProgramCurator = await isProgramCuratedByUser(userId, programId);
    const isEpisodeCurator = await isEpisodeCuratedByUser(userId, programId, episodeNumber);

    let members = await fetchAllMembers();

    let program;
    let episode;

    if (!isAdmin && !isProgramCurator && !isEpisodeCurator) {
        redirect(302, '/studio/programs');
    } else {
        program = await fetchProgramById(programId);
        episode = await fetchEpisodeByNumber(programId, params.episodeNumber);
    }

    if (!isAdmin) {
        user = await fetchMemberById(userId);
    }

    return {
        user,
        userRole: isAdmin
        ? 'admin' 
        : (isProgramCurator
            ? 'programCurator' 
            : (isEpisodeCurator
                ? 'episodeCurator'
                : null
            )),
        program,
        episode,
        members
    }
  }

  export const actions = {

    editEpisode: async ({ request }) => {
        const data = await request.formData();
        const numberBeforeChange = data.get('numberBeforeChange');
        const programId = data.get('programId');
        const number = data.get('number');
        const title = data.get('title');
        const synopsis = data.get('synopsis');
        const fileLink = data.get('fileLink');
        const streamingLink = data.get('streamingLink');
        const isAvailableLocally = data.get('isAvailableLocally' );
        const duration = data.get('duration');
        
        const curators = JSON.parse(data.get('curators'));

        if (!Number.isInteger(Number(number))) {
            return {
            error: 'Número deve ser um inteiro'
            };
        }

        try {
            await db.query('UPDATE episode SET number = $1, title = $2, synopsis = $3, filelink = $4, streaminglink = $5, isavailablelocally = $6, duration = $7 WHERE program_id = $8 AND number = $9', [number, title, synopsis, fileLink, streamingLink, isAvailableLocally, duration, programId, numberBeforeChange]);
            await db.query('DELETE FROM episode_curator WHERE episode_number = $1 AND episode_program_id = $2', [number, programId]);
            curators.forEach(async curator => {
                await db.query('INSERT INTO episode_curator (episode_number, episode_program_id, member_account_id) VALUES ($1, $2, $3)', [number, programId, curator]);
            });
            
        } catch (err) {
            return {
                error: 'Erro ao editar programa' + err
            };
        }
        
        redirect(302, '/studio/programs/'+programId);
        
    }
}