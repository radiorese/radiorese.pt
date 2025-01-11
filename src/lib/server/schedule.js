import { db } from '$lib/db';

export async function fetchWeeklySchedule(mondayDate) {

    let weeklySchedule = [];

    for (let index = 0; index < 7; index++) {
        let date = new Date(mondayDate);
        date.setDate(date.getDate() + index);
        date = date.toISOString().split('T')[0];
        
        const dailySchedule = await db.query('SELECT * FROM episodeschedule WHERE day = $1 ORDER BY startingtime', [date]);
        weeklySchedule[index] = dailySchedule.rows;
    }
    
    return weeklySchedule;
    
}