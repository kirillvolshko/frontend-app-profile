import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, StatefulButton } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './FormControls.messages';

const FormControls = ({
  cancelHandler, changeHandler, visibility, visibilityId, saveState, intl, saveData,
}) => {
  useEffect(() => {
    if (saveData) {

      handleSaveClick();
    }
  }, [saveData]);

  const handleSaveClick = () => {
    // Логика нажатия на кнопку сохранения
    const button = document.querySelector(`.pgn__stateful-btn[aria-controls="${visibilityId}"]`);
    if (button) {
      button.click();
    }
  };

  // Выбираем правильное состояние для StatefulButton
  const buttonState = saveData ? 'pending' : (saveState === 'error' ? null : saveState);

  return (
    <div className="d-flex flex-row-reverse flex-wrap justify-content-end align-items-center">
      <div className="form-group d-flex flex-wrap">
        {/* Здесь можно добавить VisibilitySelect, если нужно */}
      </div>
      <div className="form-group flex-shrink-0 flex-grow-1">
        <StatefulButton
          type="submit"
          state={buttonState}
          labels={{
            default: intl.formatMessage(messages['profile.formcontrols.button.save']),
            pending: intl.formatMessage(messages['profile.formcontrols.button.saving']),
            complete: intl.formatMessage(messages['profile.formcontrols.button.saved']),
          }}
          onClick={(e) => {
            if (buttonState === 'pending') {
              e.preventDefault();
            }
          }}
          disabledStates={[]}
        />
        <Button variant="link" onClick={cancelHandler}>
          {intl.formatMessage(messages['profile.formcontrols.button.cancel'])}
        </Button>
      </div>
    </div>
  );
};

FormControls.propTypes = {
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  visibilityId: PropTypes.string.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  saveData: PropTypes.bool.isRequired, // Новое свойство для управления автосохранением
  intl: intlShape.isRequired,
};

FormControls.defaultProps = {
  visibility: 'private',
  saveState: null,
};

export default injectIntl(FormControls);
