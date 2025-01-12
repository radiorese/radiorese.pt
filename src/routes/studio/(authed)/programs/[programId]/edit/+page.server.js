import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { isProgramCuratedByUser, fetchProgramById } from '$lib/server/programs.js';

export async function load({ params, locals }) {

    const { programId } = params;
    let user = locals.user;
    const userId = user.id;

    const isProgramCurator = await isProgramCuratedByUser(userId, programId);
    let program;

    if (!isProgramCurator) {
        redirect(302, '/studio/programs');
    } else {
        program = await fetchProgramById(programId);
    }

    return {
        user,
        userRole: isProgramCurator
        ? 'programCurator' 
        : null,
        program
    }
  }

  export const actions = {

    editProgram: async ({ request }) => {

        const data = await request.formData();
        const title = data.get('title');
        const synopsis = data.get('synopsis');
        const id = data.get('id');

        //insert to db
        try {
            await db.query('UPDATE program SET title = $1, synopsis = $2 WHERE id = $3', [title, synopsis, id]);
            
        } catch (err) {
            return {
                error: 'Erro ao editar programa: ' + err
            };
        }
        redirect(302, '/studio/programs/'+id);
    },
};