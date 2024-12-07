import { db } from '$lib/db';
import { fetchActiveMembers , fetchAllMembers } from '$lib/server/members.js';
import { redirect } from '@sveltejs/kit';
import { fetchProgramById } from '$lib/server/programs.js';

export async function load({ params }) {

        const { programId } = params;

        let activeMembers = await fetchActiveMembers();
        let allMembers = await fetchAllMembers();

        let program = await fetchProgramById(programId);

        return { activeMembers, allMembers, program };
}

export const actions = {

    editProgram: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        const mediaType = data.get('mediaType');
        const title = data.get('title');
        const synopsis = data.get('synopsis');
        const creators = JSON.parse(data.get('creators'));
        const curators = JSON.parse(data.get('curators'));

        try {
            await db.query('UPDATE program SET title = $1, synopsis = $2, mediatype = $3 WHERE id = $4', [title, synopsis, mediaType, id]);
            await db.query('DELETE FROM program_creator WHERE program_id = $1', [id]);
            await db.query('DELETE FROM program_curator WHERE program_id = $1', [id]);
            creators.forEach(async creator => {
                await db.query('INSERT INTO program_creator (program_id, member_account_id) VALUES ($1, $2)', [id, creator]);
            });
            curators.forEach(async curator => {
                await db.query('INSERT INTO program_curator (program_id, member_account_id) VALUES ($1, $2)', [id, curator]);
            });
            
        } catch (err) {
            return {
                error: 'Erro ao editar programa: ' + err
            };
        }
        
        throw redirect(302, '/studio/programs/' + id);
        
    }
}