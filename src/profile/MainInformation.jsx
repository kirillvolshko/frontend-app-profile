import React from 'react'
import { formatDistanceToNow, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
function MainInformation({ username, date }) {
    const formatDateJoined = (dateJoined) => {
        const joinedDate = new Date(dateJoined);
        const now = new Date();

        const yearsDifference = differenceInYears(now, joinedDate);
        if (yearsDifference >= 1) {
            return `${yearsDifference} ${yearsDifference === 1 ? 'рік' : 'років'} з Prometheus`;
        }

        const monthsDifference = differenceInMonths(now, joinedDate);
        if (monthsDifference >= 1) {
            return `${monthsDifference} ${monthsDifference === 1 ? 'місяць' : 'місяців'} з Prometheus`;
        }

        const daysDifference = differenceInDays(now, joinedDate);
        return `${daysDifference} ${daysDifference === 1 ? 'день' : 'днів'} з Prometheus`;
    };
    return (
        <div className='tw-text-center tw-mt-[24px] tw-mb-[50px]'>
            <h3 className='tw-text-[28px] tw-text-neutral-1000 font-medium leading-[33.6px] tw-mb-[16px]'>{username}</h3>
            <p className='tw-text-[16px] tw-text-neutral-600 font-medium leading-[24px]'>{formatDateJoined(date)}</p>
        </div>
    )
}

export default MainInformation