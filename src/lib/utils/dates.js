let months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function formatDate(day) {
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

export function getRelativeWeekString(mondayDate) {
    const today = new Date();
    const start = new Date(mondayDate);

    const diffInTime = today.getTime() - start.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks === 0) {
        return "Esta Semana";
    } else if (diffInWeeks === -1) {
        return "Próxima Semana";
    } else if (diffInWeeks < -1) {
        return `Daqui a ${Math.abs(diffInWeeks)} Semanas`;
    } else if (diffInWeeks === 1) {
        return "Semana Passada";
    } else if (diffInWeeks > 1) {
        return `Há ${Math.abs(diffInWeeks)} Semanas Atrás`;
    }
}

export function formatTimestampToDay(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${day}${month}'${year}`;
}