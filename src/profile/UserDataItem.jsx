import React, { useState, useEffect } from 'react';
import EditableField from './EditableField';

function UserDataItem({ label, data, changeData, saveData, username, field, onSaveComplete }) {
    const [displayData, setDisplayData] = useState(data);

    const getDataLabel = (data) => {
        switch (data) {
            case 'm':
                return 'Чоловіча';
            case 'f':
                return 'Жіноча';
            default:
                return data;
        }
    };

    useEffect(() => {
        setDisplayData(data);
    }, [data]);

    return (
        <div className='tw-mb-[40px]'>
            <div className={changeData ? '' : 'tw-hidden'}>
                <EditableField
                    value={username}
                    field={field}
                    label={label}
                    saveData={saveData}
                    onDataChange={(newData) => setDisplayData(newData)}
                    onSaveComplete={onSaveComplete}
                />
            </div>
            <div className={changeData ? 'tw-hidden' : 'tw-block'}>
                <label className='tw-text-[16px] tw-text-neutral-600 font-medium leading-[21.12px]'>{label}</label>
                <p className='tw-text-[16px] tw-text-neutral-1000 font-medium leading-[24px]'>{getDataLabel(displayData)}</p>
            </div>
        </div>
    );
}

export default UserDataItem;
