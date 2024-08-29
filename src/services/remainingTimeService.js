import dayjs from 'dayjs';

export function calculateRemainingTime(estimatedFinishDate, completionDate = null) {
    const finishDate = dayjs(estimatedFinishDate).startOf('day');
    let today = dayjs().startOf('day');
    
    if (completionDate) {
        today = dayjs(completionDate).startOf('day');
    }

    const differenceInDays = finishDate.diff(today, 'day');
    
    let status = '';
    let color = '';

    if (completionDate) {
        if (differenceInDays > 0) {
            status = `${Math.abs(differenceInDays)} gün erken bitti`;
            color = '#88D66C';
        } else if (differenceInDays < 0) {
            status = `${Math.abs(differenceInDays)} gün geç bitti`;
            color = '#F94A29';
        } else {
            status = 'Zamanında bitti';
            color = '#faa405';
        }
    } else {
        if (differenceInDays > 3) {
            status = `${differenceInDays} gün kaldı`;
            color = '#88D66C'; // Yeşil renk
        } else if (differenceInDays > 0 && differenceInDays <= 3) {
            status = `${differenceInDays} gün kaldı`;
            color = '#faa405'; // Turuncu renk
        } else if (differenceInDays === 0) {
            status = 'Bugün';
            color = '#faa405'; // Turuncu renk
        } else {
            status = `${Math.abs(differenceInDays)} gün geçti`;
            color = '#F94A29'; // Kırmızı renk
        }
    }

    return {
        days: differenceInDays,
        status: status,
        color: color,
    };
}

export function getColorForRemainingTime(estimatedFinishDate, isCompleted=false) {
    const today = dayjs().startOf('day');
    const finishDate = dayjs(estimatedFinishDate).startOf('day');
    
    const differenceInDays = finishDate.diff(today, 'day');

    if (isCompleted) {
        return "yeşil";
    }

    if (differenceInDays < 0) {
        return "kırmızı";
    }
    
    if (differenceInDays <= 3) {
        return "turuncu";
    } 

    return "";
}