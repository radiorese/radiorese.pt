import { fetchPrograms , fetchProgramsByAccountId } from '$lib/server/programs.js';

export async function load({ locals }) {
    try {
        let programs;
        let userIsAdmin = locals.user.isAdmin;
        if(userIsAdmin) {
            programs = await fetchPrograms();
        } else {
            programs = await fetchProgramsByAccountId(locals.user.id);
        }
        return { programs, userIsAdmin };
    } catch (err) {
        console.error('Error loading members:', err);
    }
}