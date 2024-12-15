import { fetchPrograms } from '$lib/server/programs';

export const load = ({ params }) => {

    const currentDate = params.date;
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const mondayDate = new Date(date.setDate(diff)).toISOString().split('T')[0];

    const allPrograms = fetchPrograms();
    
    return {
        currentDate,
        mondayDate,
        allPrograms
    };
};
