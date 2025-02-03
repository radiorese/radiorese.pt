import { anyEpisodeNotAvailableLocally } from '$lib/server/episodes';

export const load = async ({ locals }) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    let episodesToDownload = false;
    
    if (locals.user.isAdmin) {
        episodesToDownload = await anyEpisodeNotAvailableLocally();
    }
    
    return {
        episodesToDownload,
        user: locals.user,
        currentDate
    };
};
