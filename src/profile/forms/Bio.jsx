import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import messages from './Bio.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

const Bio = ({
  formId,
  bio,
  visibilityBio,
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
  const [editModeState, setEditModeState] = useState(changeData ? 'editing' : editMode);

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
              <Form.Group
                controlId={formId}
                isInvalid={error !== null}
              >
                <label className="tw-block tw-text-[16px] tw-text-neutral-600 font-medium leading-[21.12px]" htmlFor={formId}>
                  {intl.formatMessage(messages['profile.bio.about.me'])}
                </label>
                <textarea
                  className="input-large"
                  id={formId}
                  name={formId}
                  value={bio}
                  onChange={handleChange}
                />
                {error !== null && (
                  <Form.Control.Feedback hasIcon={false}>
                    {error}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <div className='tw-hidden'>
                <FormControls
                  visibilityId="visibilityBio"
                  saveState={saveState}
                  visibility={visibilityBio}
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
              content={intl.formatMessage(messages['profile.bio.about.me'])}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityBio !== null}
              visibility={visibilityBio}
            />
            <p data-hj-suppress className="lead">{bio}</p>
          </>
        ),
        empty: (
          <>
            <EditableItemHeader content={intl.formatMessage(messages['profile.bio.about.me'])} />
            <EmptyContent onClick={handleOpen}>
              <FormattedMessage
                id="profile.bio.empty"
                defaultMessage="Add a short bio"
                description="instructions when the user hasn't written an About Me"
              />
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <EditableItemHeader content={intl.formatMessage(messages['profile.bio.about.me'])} />
            <p data-hj-suppress className="lead tw-text-[16px] tw-text-neutral-1000 font-medium leading-[24px]">{bio}</p>
          </>
        ),
      }}
    />
  );
};

Bio.propTypes = {
  formId: PropTypes.string.isRequired,
  bio: PropTypes.string,
  visibilityBio: PropTypes.oneOf(['private', 'all_users']),
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

Bio.defaultProps = {
  editMode: 'static',
  saveState: null,
  bio: null,
  visibilityBio: 'private',
  error: null,
  changeData: false,
  saveData: false,
  onSaveComplete: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Bio));
