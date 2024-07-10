import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';
import { Form } from '@edx/paragon';

import messages from './Education.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Constants
import { EDUCATION_LEVELS } from '../data/constants';

// Selectors
import { editableFormSelector } from '../data/selectors';

const Education = ({
  formId,
  levelOfEducation,
  visibilityLevelOfEducation,
  editMode,
  saveState,
  error,
  intl,
  changeData,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
  saveData,
  onSaveComplete,
}) => {
  const [editModeState, setEditModeState] = useState(changeData ? 'editing' : 'static');

  useEffect(() => {
    if (changeData) {
      handleOpen();
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
    setEditModeState('static');
  };

  const handleOpen = () => {
    openHandler(formId);
    setEditModeState('editing');
  };

  return (
    <SwitchContent
      className="mb-5"
      expression={editModeState}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${formId}-label`}>
            <form onSubmit={handleSubmit}>
              <Form.Group controlId={formId} isInvalid={error !== null}>
                <label className="tw-block tw-text-[16px] tw-text-neutral-600 font-medium leading-[21.12px]" htmlFor={formId}>
                  {intl.formatMessage(messages['profile.education.education'])}
                </label>
                <select
                  data-hj-suppress
                  className="select-input"
                  id={formId}
                  name={formId}
                  value={levelOfEducation}
                  onChange={handleChange}
                >
                  <option value="">&nbsp;</option>
                  {EDUCATION_LEVELS.map(level => (
                    <option key={level} value={level}>
                      {intl.formatMessage(get(
                        messages,
                        `profile.education.levels.${level}`,
                        messages['profile.education.levels.o'],
                      ))}
                    </option>
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
                  visibilityId="visibilityLevelOfEducation"
                  saveState={saveState}
                  visibility={visibilityLevelOfEducation}
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
              content={intl.formatMessage(messages['profile.education.education'])}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityLevelOfEducation !== null}
              visibility={visibilityLevelOfEducation}
            />
            <p data-hj-suppress className="h5">
              {intl.formatMessage(get(
                messages,
                `profile.education.levels.${levelOfEducation}`,
                messages['profile.education.levels.o'],
              ))}
            </p>
          </>
        ),
        empty: (
          <>
            <EditableItemHeader content={intl.formatMessage(messages['profile.education.education'])} />
            <EmptyContent onClick={handleOpen}>
              <FormattedMessage
                id="profile.education.empty"
                defaultMessage="Add education"
                description="instructions when the user doesn't have their level of education set"
              />
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <EditableItemHeader content={intl.formatMessage(messages['profile.education.education'])} />
            <p data-hj-suppress className="tw-text-[16px] tw-text-neutral-1000 font-medium leading-[24px]">
              {intl.formatMessage(get(
                messages,
                `profile.education.levels.${levelOfEducation}`,
                messages['profile.education.levels.o'],
              ))}
            </p>
          </>
        ),
      }}
    />
  );
};

Education.propTypes = {
  formId: PropTypes.string.isRequired,
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  changeData: PropTypes.bool,
  saveData: PropTypes.bool,
  onSaveComplete: PropTypes.func,
};

Education.defaultProps = {
  editMode: 'static',
  saveState: null,
  levelOfEducation: null,
  visibilityLevelOfEducation: 'private',
  error: null,
  changeData: false,
  saveData: false,
  onSaveComplete: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Education));
