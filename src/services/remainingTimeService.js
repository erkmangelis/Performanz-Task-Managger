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
            color = '#FFEA20';
        }
    } else {
        if (differenceInDays > 0) {
            status = `${differenceInDays} gün kaldı`;
            color = '#88D66C';
        } else if (differenceInDays < 0) {
            status = `${Math.abs(differenceInDays)} gün geçti`;
            color = '#F94A29';
        } else {
            status = 'Bugün';
            color = '#FFEA20';
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