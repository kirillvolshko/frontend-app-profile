import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import messages from './Country.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { countrySelector } from '../data/selectors';

const Country = ({
  formId,
  country,
  visibilityCountry,
  saveState,
  error,
  intl,
  sortedCountries,
  countryMessages,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
  changeData,
  saveData,
  onSaveComplete,
  editMode: initialEditMode,
}) => {
  const [editMode, setEditMode] = useState(changeData ? 'editing' : initialEditMode);
  useEffect(() => {
    if (changeData) {
      setEditMode('editing');
    } else {
      handleClose();
    }
  }, [changeData]);

  useEffect(() => {
    if (saveData) {
      handleSubmit();
    }
  }, [saveData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    changeHandler(name, value);
  };

  const handleSubmit = (e) => {
    // Проверяем, есть ли объект события
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    submitHandler(formId);
    if (onSaveComplete) {
      onSaveComplete(); // Сбрасываем состояние saveData в родительском компоненте
    }
  };

  const handleClose = () => {
    closeHandler(formId);
    setEditMode('static');
  };

  const handleOpen = () => {
    openHandler(formId);
    setEditMode('editing');
  };

  return (
    <SwitchContent
      className="mb-5"
      expression={editMode}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${formId}-label`}>
            <form onSubmit={handleSubmit}>
              <Form.Group controlId={formId} isInvalid={error !== null}>
                <label className="tw-block tw-text-[16px] tw-text-neutral-600 font-medium leading-[21.12px]" htmlFor={formId}>
                  {intl.formatMessage(messages['profile.country.label'])}
                </label>
                <select
                  data-hj-suppress
                  className="select-input"
                  type="select"
                  id={formId}
                  name={formId}
                  value={country}
                  onChange={handleChange}
                >
                  <option value="">&nbsp;</option>
                  {sortedCountries.map(({ code, name }) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
                {error !== null && (
                  <Form.Control.Feedback hasIcon={false}>
                    {error}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <div className='tw-hidden'>
                <FormControls
                  visibilityId="visibilityCountry"
                  saveState={saveState}
                  visibility={visibilityCountry}
                  cancelHandler={handleClose}
                  changeHandler={handleChange}
                  saveData={saveData} // Передаем состояние saveData в FormControls
                />
              </div>
            </form>
          </div>
        ),
        editable: (
          <>
            <EditableItemHeader
              content={intl.formatMessage(messages['profile.country.label'])}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityCountry !== null}
              visibility={visibilityCountry}
            />
            <p data-hj-suppress className="h5">{countryMessages[country]}</p>
          </>
        ),
        empty: (
          <>
            <EditableItemHeader content={intl.formatMessage(messages['profile.country.label'])} />
            <EmptyContent onClick={handleOpen}>
              {intl.formatMessage(messages['profile.country.empty'])}
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <EditableItemHeader content={intl.formatMessage(messages['profile.country.label'])} />
            <p data-hj-suppress className="tw-text-[16px] tw-text-neutral-1000 font-medium leading-[24px]">{countryMessages[country]}</p>
          </>
        ),
      }}
    />
  );
};

Country.propTypes = {
  formId: PropTypes.string.isRequired,
  country: PropTypes.string,
  visibilityCountry: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  sortedCountries: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  countryMessages: PropTypes.objectOf(PropTypes.string).isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  changeData: PropTypes.bool,
  saveData: PropTypes.bool,
  onSaveComplete: PropTypes.func,
};

Country.defaultProps = {
  editMode: 'static',
  saveState: null,
  country: null,
  visibilityCountry: 'private',
  error: null,
  changeData: false,
  saveData: false,
  onSaveComplete: null,
};

export default connect(
  countrySelector,
  {},
)(injectIntl(Country));
