import React from 'react';
import PropTypes from 'prop-types';

import EditButton from './EditButton';
import { Visibility } from './Visibility';

const EditableItemHeader = ({
  content,
  showVisibility,
  visibility,
  showEditButton,
  onClickEdit,
  headingId,
}) => (
  <div className="editable-item-header tw-mb-[8px]">
    <h2 className="tw-text-[16px] tw-text-neutral-600 font-medium leading-[21.12px]" id={headingId}>
      {content}
    </h2>
    {showVisibility ? <p className="mb-0"><Visibility to={visibility} /></p> : null}
  </div>
);

export default EditableItemHeader;

EditableItemHeader.propTypes = {
  onClickEdit: PropTypes.func,
  showVisibility: PropTypes.bool,
  showEditButton: PropTypes.bool,
  content: PropTypes.node,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  headingId: PropTypes.string,
};

EditableItemHeader.defaultProps = {
  onClickEdit: () => { },
  showVisibility: false,
  showEditButton: false,
  content: '',
  visibility: 'private',
  headingId: null,
};
