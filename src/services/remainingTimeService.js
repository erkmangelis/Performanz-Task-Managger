import dayjs from 'dayjs';

export function calculateRemainingTime(estimatedFinishDate) {
    const today = dayjs().startOf('day');
    const finishDate = dayjs(estimatedFinishDate).startOf('day');
    
    const differenceInDays = finishDate.diff(today, 'day');
    
    let status = '';
    let color = '';

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

    return {
        days: differenceInDays,
        status: status,
        color: color,
    };
}
