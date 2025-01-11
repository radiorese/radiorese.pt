let months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function formatDateRange(day) {
    const date = new Date(day);
    const formattedDate = `${date.getDate()}${months[date.getMonth()]}'${date.getFullYear().toString().slice(-2)}`;
    return formattedDate;
}

export function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date); // Ensure date is a Date object
    return (
        checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear()
    );
}

export function isThisWeek(startingDate, endingDate) {
    const today = new Date();
    const start = new Date(startingDate);
    const end = new Date(endingDate);
    return today >= start && today <= end;
}

export function getDateSum(date, days) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    newDate = newDate.toISOString().split('T')[0];
    return newDate;
}

export function secondsToTimeStamp(seconds) {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}