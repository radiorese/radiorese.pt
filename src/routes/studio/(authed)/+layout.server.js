export const load = ({ locals }) => {
    const currentDate = new Date().toISOString().split('T')[0];
    return {
        user: locals.user,
        currentDate
    };
};
