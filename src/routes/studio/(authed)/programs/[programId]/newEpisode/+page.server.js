import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { fetchMemberById , fetchAllMembers } from '$lib/server/members';
import { isProgramCuratedByUser , fetchProgramById } from '$lib/server/programs.js';


export async function load({ params, locals }) {

    const { programId } = params;
    let user = locals.user;
    const userId = user.id;

    const isAdmin = locals.user.isAdmin;
    const isProgramCurator = await isProgramCuratedByUser(userId, programId);

    let members = await fetchAllMembers();

    let program;

    if (!isAdmin && !isProgramCurator) {
        throw redirect(302, '/studio/programs');
    } else {
        program = await fetchProgramById(programId);
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
            : null),
        program,
        members
    }
  }

  export const actions = {

    addEpisode: async ({ request }) => {
        const data = await request.formData();

        const programId = data.get('programId');
        const number = data.get('number');
        const title = data.get('title');
        const synopsis = data.get('synopsis');
        const fileLink = data.get('fileLink');
        const streamingLink = data.get('streamingLink');
        const isAvailableLocally = false;
        const duration = data.get('duration');
        
        const curators = JSON.parse(data.get('curators'));

        if (!Number.isInteger(Number(number))) {
            return {
            error: 'Número deve ser um inteiro'
            };
        }

        try {
            await db.query('INSERT INTO episode (program_id, number, title, synopsis, filelink, streaminglink, isavailablelocally, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [programId, number, title, synopsis, fileLink, streamingLink, isAvailableLocally, duration]);
            curators.forEach(async curator => {
                await db.query('INSERT INTO episode_curator (episode_number, episode_program_id, member_account_id) VALUES ($1, $2, $3)', [number, programId, curator]);
            });
            
        } catch (err) {
            return {
                error: 'Erro ao adicionar programa' + err
            };
        }
        
        throw redirect(302, '/studio/programs/'+programId);
        
    }
}
  