import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@edx/paragon';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './SocialLinks.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

const platformDisplayInfo = {
  facebook: {
    icon: faFacebook,
    name: 'Facebook',
  },
  twitter: {
    icon: faTwitter,
    name: 'Twitter',
  },
  linkedin: {
    icon: faLinkedin,
    name: 'LinkedIn',
  },
};

const SocialLinks = ({
  formId,
  socialLinks,
  draftSocialLinksByPlatform,
  visibilitySocialLinks,
  editMode: initialEditMode,
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
  const [editMode, setEditMode] = useState(changeData ? 'editing' : initialEditMode);

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

    if (name !== 'visibilitySocialLinks') {
      changeHandler(
        'socialLinks',
        mergeWithDrafts({
          platform: name,
          socialLink: value || null,
        }),
      );
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
    setEditMode('static');
  };

  const handleOpen = () => {
    openHandler(formId);
    setEditMode('editing');
  };

  const mergeWithDrafts = (newSocialLink) => {
    const knownPlatforms = ['twitter', 'facebook', 'linkedin'];
    const updated = [];
    knownPlatforms.forEach((platform) => {
      if (newSocialLink.platform === platform) {
        updated.push(newSocialLink);
      } else if (draftSocialLinksByPlatform[platform] !== undefined) {
        updated.push(draftSocialLinksByPlatform[platform]);
      }
    });
    return updated;
  };

  return (
    <SwitchContent
      className="mb-5"
      expression={editMode}
      cases={{
        empty: (
          <>
            <EditableItemHeader content={intl.formatMessage(messages['profile.sociallinks.social.links'])} />
            <ul className="list-unstyled">
              {socialLinks.map(({ platform }) => (
                <EmptyListItem
                  key={platform}
                  onClick={handleOpen}
                  name={platformDisplayInfo[platform].name}
                />
              ))}
            </ul>
          </>
        ),
        static: (
          <>
            <ul className="list-unstyled">
              {socialLinks
                .filter(({ socialLink }) => Boolean(socialLink))
                .map(({ platform, socialLink }) => (
                  <StaticListItem
                    key={platform}
                    name={platformDisplayInfo[platform].name}
                    url={socialLink}
                    platform={platform}
                  />
                ))}
            </ul>
          </>
        ),
        editable: (
          <>
            <EditableItemHeader
              content={intl.formatMessage(messages['profile.sociallinks.social.links'])}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilitySocialLinks !== null}
              visibility={visibilitySocialLinks}
            />
            <ul className="list-unstyled">
              {socialLinks.map(({ platform, socialLink }) => (
                <EditableListItem
                  key={platform}
                  platform={platform}
                  name={platformDisplayInfo[platform].name}
                  url={socialLink}
                  onClickEmptyContent={handleOpen}
                />
              ))}
            </ul>
          </>
        ),
        editing: (
          <div role="dialog" aria-labelledby="social-links-label">
            <form aria-labelledby="editing-form" onSubmit={handleSubmit}>
              <div id="social-error-feedback">
                {error !== null && (
                  <Alert variant="danger" dismissible={false} show>
                    {error}
                  </Alert>
                )}
              </div>
              <ul className="list-unstyled">
                {socialLinks.map(({ platform, socialLink }) => (
                  <EditingListItem
                    key={platform}
                    name={platformDisplayInfo[platform].name}
                    platform={platform}
                    value={socialLink}
                    onChange={handleChange}
                    error={error}
                  />
                ))}
              </ul>
              <div className='tw-hidden'>
                <FormControls
                  visibilityId="visibilitySocialLinks"
                  saveState={saveState}
                  visibility={visibilitySocialLinks}
                  cancelHandler={handleClose}
                  changeHandler={handleChange}
                  saveData={saveData} // Передаем состояние saveData в FormControls
                />
              </div>
            </form>
          </div>
        ),
      }}
    />
  );
};

SocialLinks.propTypes = {
  formId: PropTypes.string.isRequired,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })).isRequired,
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  changeData: PropTypes.bool,
  intl: intlShape.isRequired,
};

SocialLinks.defaultProps = {
  editMode: 'static',
  saveState: null,
  draftSocialLinksByPlatform: {},
  visibilitySocialLinks: 'private',
  error: null,
  changeData: false,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(SocialLinks));

const SocialLink = ({ url, name, platform }) => (
  <a href={url} className="font-weight-bold">
    <FontAwesomeIcon className="mr-2" icon={platformDisplayInfo[platform].icon} />
    {name}
  </a>
);

SocialLink.propTypes = {
  url: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const EditableListItem = ({
  url, platform, onClickEmptyContent, name,
}) => {
  const linkDisplay = url ? (
    <SocialLink name={name} url={url} platform={platform} />
  ) : (
    <EmptyContent onClick={onClickEmptyContent}>Add {name}</EmptyContent>
  );

  return <li className="form-group">{linkDisplay}</li>;
};

EditableListItem.propTypes = {
  url: PropTypes.string,
  platform: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClickEmptyContent: PropTypes.func,
};

EditableListItem.defaultProps = {
  url: null,
  onClickEmptyContent: null,
};

const EditingListItem = ({
  platform, name, value, onChange, error,
}) => (
  <li className="form-group">
    <label htmlFor={`social-${platform}`}>{name}</label>
    <div className='tw-relative'>
      <FontAwesomeIcon className="tw-absolute tw-left-[14px] tw-top-[50%] -tw-translate-y-1/2" icon={platformDisplayInfo[platform].icon} />
      <input

        className={classNames('input-text', { 'is-invalid': Boolean(error) })}
        type="text"
        id={`social-${platform}`}
        name={platform}
        value={value || ''}
        onChange={onChange}
        aria-describedby="social-error-feedback"
      />
    </div>

  </li>
);

EditingListItem.propTypes = {
  platform: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

EditingListItem.defaultProps = {
  value: null,
  error: null,
};

const EmptyListItem = ({ onClick, name }) => (
  <li className="mb-4">
    <EmptyContent onClick={onClick}>
      <FormattedMessage
        id="profile.sociallinks.add"
        defaultMessage="Add {network}"
        values={{
          network: name,
        }}
        description="{network} is the name of a social network such as Facebook or Twitter"
      />
    </EmptyContent>
  </li>
);

EmptyListItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const StaticListItem = ({ name, url, platform }) => (
  <li className="mb-2">
    <SocialLink name={name} url={url} platform={platform} />
  </li>
);

StaticListItem.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
  platform: PropTypes.string.isRequired,
};

StaticListItem.defaultProps = {
  url: null,
};
