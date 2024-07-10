import React, { useEffect, useState } from 'react';
import { getAccountData, updateAccount } from './data/services.js';

function EditableField({ value, field, saveData, label, onDataChange, onSaveComplete }) {
    const [initialGender, setInitialGender] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await getAccountData(value);
                const gender = data.gender || '';
                setSelectedGender(gender);
                setInitialGender(gender);
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };
        fetchInitialData();
    }, [value]);


    useEffect(() => {
        if (saveData && selectedGender && selectedGender !== initialGender) {
            const updateData = async () => {
                setIsLoading(true);
                try {
                    await updateAccount(value, field, selectedGender);
                    console.log('Account updated successfully');
                } catch (error) {
                    console.error('Error updating account:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            updateData();
            onSaveComplete();
            if (onDataChange) {
                onDataChange(selectedGender);
            }
        }
    }, [saveData, selectedGender, initialGender, value, field]);



    if (!value) {
        return null;
    }

    return (
        <div>
            <div className='tw-flex tw-flex-col tw-mb-[15px]'>
                <label className='tw-mb-[8px] tw-text-[16px] tw-text-neutral-600 font-medium leading-[21.12px]'>{label}</label>
                <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    disabled={isLoading}
                    className='select-input'
                >
                    <option value="">Оберіть пол</option>
                    <option value="m">Чоловічий</option>
                    <option value="f">Жіночий</option>
                </select>
            </div>
        </div>
    );
}

export default EditableField;
