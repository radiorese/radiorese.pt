import { redirect } from '@sveltejs/kit';
import { fetchMemberById } from '$lib/server/members';
import { isProgramCuratedByUser , isProgramCreatedByUser , fetchProgramById , hasUserCuratedAnyEpisodeInProgram } from '$lib/server/programs.js';


export async function load({ params, locals }) {

    const { programId } = params;
    let user = locals.user;
    const userId = user.id;

    const isAdmin = locals.user.isAdmin;
    const isProgramCurator = await isProgramCuratedByUser(userId, programId);
    const isProgramCreator = await isProgramCreatedByUser(userId, programId);
    const isEpisodeCurator = await hasUserCuratedAnyEpisodeInProgram(userId, programId);
    let program;

    if (!isAdmin && !isProgramCurator && !isProgramCreator && !isEpisodeCurator) {
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
            : (isProgramCreator
                ? 'programCreator' 
                : (isEpisodeCurator
                    ? 'episodeCurator' 
                    : null))),
        program
    }
  }
  