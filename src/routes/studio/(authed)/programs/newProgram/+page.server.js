import { fetchActiveMembers , fetchAllMembers } from '$lib/server/members.js';
import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    try {
        let activeMembers = await fetchActiveMembers();
        let allMembers = await fetchAllMembers();

        return { activeMembers, allMembers };
    } catch (err) {
        console.error('Error loading members:', err);
    }
}

export const actions = {

    addProgram: async ({ request }) => {
        const data = await request.formData();
        const mediaType = data.get('mediaType');
        const title = data.get('title');
        const synopsis = data.get('synopsis');
        const creators = JSON.parse(data.get('creators'));
        const curators = JSON.parse(data.get('curators'));
        
        let highestId = await db.query('SELECT MAX(id) FROM program');
        highestId = highestId.rows[0].max || 0;
        let id = highestId + 1;

        let titleCheck = await db.query('SELECT * FROM program WHERE title = $1', [title]);
        if (titleCheck.rows.length > 0) {
            return {
                error: 'Título já está em uso'
            };
        }

        try {
            await db.query('INSERT INTO program (id, title, synopsis, mediatype) VALUES ($1, $2, $3, $4)', [id, title, synopsis, mediaType]);
            creators.forEach(async creator => {
                await db.query('INSERT INTO program_creator (program_id, member_account_id) VALUES ($1, $2)', [id, creator]);
            });
            curators.forEach(async curator => {
                await db.query('INSERT INTO program_curator (program_id, member_account_id) VALUES ($1, $2)', [id, curator]);
            });
            
        } catch (err) {
            return {
                error: 'Erro ao adicionar programa' + err
            };
        }
        
        throw redirect(302, '/studio/programs');
        
    }
}