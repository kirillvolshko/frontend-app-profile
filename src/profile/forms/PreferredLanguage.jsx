import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import messages from './PreferredLanguage.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { preferredLanguageSelector } from '../data/selectors';

const PreferredLanguage = ({
  formId,
  languageProficiencies,
  visibilityLanguageProficiencies,
  editMode,
  saveState,
  error,
  intl,
  sortedLanguages,
  languageMessages,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
  changeData,
  saveData,
  onSaveComplete,
}) => {
  const [currentEditMode, setCurrentEditMode] = useState(changeData ? 'editing' : 'static');

  useEffect(() => {
    if (changeData) {
      setCurrentEditMode('editing');
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
    if (name === formId) {
      if (value !== '') {
        changeHandler(name, [{ code: value }]);
      } else {
        changeHandler(name, []);
      }
    } else {
      changeHandler(name, value);
    }
  };

  const handleSubmit = (e) => {
    // Проверяем, есть ли объект события и выполняем preventDefault, если он существует
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    submitHandler(formId);
    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  const handleClose = () => {
    closeHandler(formId);
    setCurrentEditMode('static');
  };

  const handleOpen = () => {
    openHandler(formId);
    setCurrentEditMode('editing');
  };

  const value = languageProficiencies.length ? languageProficiencies[0].code : '';

  return (
    <SwitchContent
      className="mb-5"
      expression={currentEditMode}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${formId}-label`}>
            <form onSubmit={handleSubmit}>
              <Form.Group
                controlId={formId}
                isInvalid={error !== null}
              >
                <label className="tw-block tw-text-[16px] tw-text-neutral-600 font-medium leading-[21.12px]" htmlFor={formId}>
                  {intl.formatMessage(messages['profile.preferredlanguage.label'])}
                </label>
                <select
                  data-hj-suppress
                  id={formId}
                  name={formId}
                  className="select-input"
                  value={value}
                  onChange={handleChange}
                >
                  <option value="">&nbsp;</option>
                  {sortedLanguages.map(({ code, name }) => (
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
                  visibilityId="visibilityLanguageProficiencies"
                  saveState={saveState}
                  visibility={visibilityLanguageProficiencies}
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
              content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityLanguageProficiencies !== null}
              visibility={visibilityLanguageProficiencies}
            />
            <p data-hj-suppress className="h5">{languageMessages[value]}</p>
          </>
        ),
        empty: (
          <>
            <EditableItemHeader
              content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
            />
            <EmptyContent onClick={handleOpen}>
              {intl.formatMessage(messages['profile.preferredlanguage.empty'])}
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <EditableItemHeader
              content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
            />
            <p data-hj-suppress className="tw-text-[16px] tw-text-neutral-1000 font-medium leading-[24px]">{languageMessages[value]}</p>
          </>
        ),
      }}
    />
  );
};

PreferredLanguage.propTypes = {
  formId: PropTypes.string.isRequired,
  languageProficiencies: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string })),
    PropTypes.oneOf(['']),
  ]),
  visibilityLanguageProficiencies: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  sortedLanguages: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  languageMessages: PropTypes.objectOf(PropTypes.string).isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  changeData: PropTypes.bool,
  saveData: PropTypes.bool,
  onSaveComplete: PropTypes.func,
};

PreferredLanguage.defaultProps = {
  editMode: 'static',
  saveState: null,
  languageProficiencies: [],
  visibilityLanguageProficiencies: 'private',
  error: null,
  changeData: false,
  saveData: false,
  onSaveComplete: null,
};

export default connect(
  preferredLanguageSelector,
  {},
)(injectIntl(PreferredLanguage));
