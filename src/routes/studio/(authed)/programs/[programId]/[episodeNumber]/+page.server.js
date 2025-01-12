import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { fetchEpisodeByNumber, isEpisodeCuratedByUser } from '$lib/server/episodes.js';
import { isProgramCuratedByUser, fetchProgramById } from '$lib/server/programs.js';


export async function load({ params, locals }) {

    const { programId, episodeNumber } = params;
    let user = locals.user;
    const userId = user.id;

    const isAdmin = locals.user.isAdmin;
    const isProgramCurator = await isProgramCuratedByUser(userId, programId);
    const isEpisodeCurator = await isEpisodeCuratedByUser(userId, programId, episodeNumber);

    let program;
    let episode;

    if (!isAdmin && !isProgramCurator && !isEpisodeCurator) {
        redirect(302, '/studio/programs');
    } else {
        episode = await fetchEpisodeByNumber(programId, episodeNumber);
        program = await fetchProgramById(programId);
    }


    return {
       episode,
       program
    }
  }
