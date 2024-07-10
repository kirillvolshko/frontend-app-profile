import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Alert, Hyperlink } from '@edx/paragon';

// Actions
import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';

// Components
import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import Certificates from './forms/Certificates';
import AgeMessage from './AgeMessage';
import DateJoined from './DateJoined';
import UsernameDescription from './UsernameDescription';
import PageLoading from './PageLoading';
import Banner from './Banner';
import LearningGoal from './forms/LearningGoal';
import { getAccountData } from './data/services.js';
// Selectors
import { profilePageSelector } from './data/selectors';

// i18n
import messages from './ProfilePage.messages';
import withParams from '../utils/hoc';
import MainInformation from './MainInformation.jsx';
import UserDataItem from './UserDataItem.jsx';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL'], 'ProfilePage');

const ProfilePage = ({
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
  params,
  profileImage,
  savePhotoState,
  name,
  visibilityName,
  country,
  visibilityCountry,
  levelOfEducation,
  visibilityLevelOfEducation,
  socialLinks,
  draftSocialLinksByPlatform,
  visibilitySocialLinks,
  learningGoal,
  visibilityLearningGoal,
  languageProficiencies,
  visibilityLanguageProficiencies,
  courseCertificates,
  visibilityCourseCertificates,
  bio,
  visibilityBio,
  requiresParentalConsent,
  isLoadingProfile,
  dateJoined,
  photoUploadError,
  intl,
}) => {
  const context = useContext(AppContext);
  const [viewMyRecordsUrl, setViewMyRecordsUrl] = useState(null);
  const [accountSettingsUrl, setAccountSettingsUrl] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [changeAccountData, setChangeAccountData] = useState(false);
  const [submitChangeData, setSubmitChangeData] = useState(false);
  const [submitChangeDataCustom, setSubmitChangeDataCustom] = useState(false);
  useEffect(() => {
    const credentialsBaseUrl = context.config.CREDENTIALS_BASE_URL;
    setViewMyRecordsUrl(credentialsBaseUrl ? `${credentialsBaseUrl}/records` : null);
    setAccountSettingsUrl(`${context.config.LMS_BASE_URL}/account/settings`);

    const fetchAccount = async () => {
      const data = await getAccountData(params.username);
      setAccountData(data);
    };
    fetchAccount();

    fetchProfile(params.username);

    sendTrackingLogEvent('edx.profile.viewed', { username: params.username });
  }, [context.config, fetchProfile, params.username]);

  const handleSaveProfilePhoto = (formData) => {
    saveProfilePhoto(context.authenticatedUser.username, formData);
  };

  const handleDeleteProfilePhoto = () => {
    deleteProfilePhoto(context.authenticatedUser.username);
  };
  const changeAccountDataProfile = () => {
    setChangeAccountData(false);
    setSubmitChangeData(true);
    setSubmitChangeDataCustom(true);
  };
  const closeAccountDataProfile = () => {
    setChangeAccountData(false);
  };
  const handleClose = (formId) => {
    closeForm(formId);
  };

  const handleOpen = (formId) => {
    openForm(formId);
  };

  const handleSubmit = (formId) => {
    saveProfile(formId, context.authenticatedUser.username);
  };

  const handleChange = (name, value) => {
    updateDraft(name, value);
  };

  const isYOBDisabled = () => {
    const currentYear = new Date().getFullYear();
    return (!props.yearOfBirth || (currentYear - 2000) < 13) && getConfig().COLLECT_YEAR_OF_BIRTH !== 'true';
  };

  const isAuthenticatedUserProfile = () => params.username === context.authenticatedUser.username;

  const renderViewMyRecordsButton = () => {
    if (!viewMyRecordsUrl || !isAuthenticatedUserProfile()) return null;
    return (
      <Hyperlink className="btn btn-primary" destination={viewMyRecordsUrl} target="_blank">
        {intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  };

  const renderHeadingLockup = () => (
    <span data-hj-suppress>
      <h1 className="h2 mb-0 font-weight-bold text-truncate">{params.username}</h1>
      <DateJoined date={dateJoined} />
      {isYOBDisabled() && <UsernameDescription />}
      <hr className="d-none d-md-block" />
    </span>
  );

  const renderPhotoUploadErrorMessage = () => {
    if (!photoUploadError) return null;
    return (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <Alert variant="danger" dismissible={false} show>
            {photoUploadError.userMessage}
          </Alert>
        </div>
      </div>
    );
  };

  const renderAgeMessage = () => {
    if (!requiresParentalConsent || !isAuthenticatedUserProfile()) return null;
    return <AgeMessage accountSettingsUrl={accountSettingsUrl} />;
  };

  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile() || (!!blockInfo);

  const renderContent = () => {
    if (isLoadingProfile) {
      return <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />;
    }

    const commonFormProps = {
      openHandler: handleOpen,
      closeHandler: handleClose,
      submitHandler: handleSubmit,
      changeHandler: handleChange,
    };

    return (

      <div className='tw-bg-body  tw-grid tw-grid-cols-3 tw-gap-3'>
        <div className='tw-col-span-1 tw-bg-white tw-w-[376px] tw-pt-[32px] tw-px-[60px]'>
          <div>
            <div className=" tw-flex tw-justify-center">
              <ProfileAvatar
                className="mb-md-3"
                src={profileImage.src}
                isDefault={profileImage.isDefault}
                onSave={handleSaveProfilePhoto}
                onDelete={handleDeleteProfilePhoto}
                savePhotoState={savePhotoState}
                isEditable={isAuthenticatedUserProfile() && !requiresParentalConsent}
              />
            </div>
            <div className="tw-mt-[20px]">
              <MainInformation
                username={params.username}
                date={dateJoined}
              />
              <SocialLinks
                socialLinks={socialLinks}
                changeData={changeAccountData}
                saveData={submitChangeData}
                onSaveComplete={() => setSubmitChangeData(false)}
                draftSocialLinksByPlatform={draftSocialLinksByPlatform}
                visibilitySocialLinks={visibilitySocialLinks}
                formId="socialLinks"
                {...commonFormProps}
              />
              <div className="d-none d-md-block">
                {renderViewMyRecordsButton()}
              </div>
            </div>
          </div>
          <div>
            {!changeAccountData && (
              <button onClick={() => setChangeAccountData(true)} className='button-primary button-lg'>Редагувати</button>
            )}
            {changeAccountData && (
              <div>
                <button onClick={() => changeAccountDataProfile()} className='button-primary button-lg tw-mb-[10px]'>Зберегти</button>
                <button onClick={() => closeAccountDataProfile()} className='button-outlined button-lg'>Скасувати і вийти</button>
              </div>
            )}
          </div>
          {renderPhotoUploadErrorMessage()}
        </div>
        <div className=" tw-container tw-col-span-2 tw-mt-[56px]">
          <div>
            <h6 className='tw-mb-[48px] tw-text-[28px] font-medium leading-[33.6px]'>Мій профіль</h6>
          </div>
          <div className="tw-grid tw-grid-cols-2 tw-gap-4">
            <div>
              <div className="d-md-none mb-4">
                {renderViewMyRecordsButton()}
              </div>
              {accountData && (
                <div>

                  <UserDataItem
                    data={name}
                    label={intl.formatMessage(messages['profile.name.full.name'])}
                  />
                  <UserDataItem
                    data={accountData.gender}
                    username={params.username}
                    field={"gender"}
                    onSaveComplete={() => setSubmitChangeDataCustom(false)}
                    changeData={changeAccountData}
                    saveData={submitChangeDataCustom}
                    label={intl.formatMessage(messages['profile.user.gender'])}
                  />
                </div>
              )}
              {isBlockVisible(country) && (
                <Country
                  country={country}
                  changeData={changeAccountData}
                  saveData={submitChangeData}
                  onSaveComplete={() => setSubmitChangeData(false)}
                  visibilityCountry={visibilityCountry}
                  formId="country"
                  {...commonFormProps}
                />
              )}
              {isBlockVisible(languageProficiencies.length) && (
                <PreferredLanguage
                  languageProficiencies={languageProficiencies}
                  saveData={submitChangeData}
                  changeData={changeAccountData}
                  onSaveComplete={() => setSubmitChangeData(false)}
                  visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                  formId="languageProficiencies"
                  {...commonFormProps}
                />
              )}
              {isBlockVisible(levelOfEducation) && (
                <Education
                  saveData={submitChangeData}
                  changeData={changeAccountData}
                  onSaveComplete={() => setSubmitChangeData(false)}
                  levelOfEducation={levelOfEducation}
                  visibilityLevelOfEducation={visibilityLevelOfEducation}
                  formId="levelOfEducation"
                  {...commonFormProps}
                />
              )}
            </div>
            <div className="tw-flex tw-flex-col tw-justify-between">
              <div>
                {isBlockVisible(bio) && (
                  <Bio
                    saveData={submitChangeData}
                    changeData={changeAccountData}
                    onSaveComplete={() => setSubmitChangeData(false)}
                    bio={bio}
                    visibilityBio={visibilityBio}
                    formId="bio"
                    {...commonFormProps}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>



    );
  };

  return (
    <div className="profile-page">
      {renderContent()}
    </div>
  );
};

ProfilePage.propTypes = {
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  bio: PropTypes.string,
  yearOfBirth: PropTypes.number,
  visibilityBio: PropTypes.string.isRequired,
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  visibilityCourseCertificates: PropTypes.string.isRequired,
  country: PropTypes.string,
  visibilityCountry: PropTypes.string.isRequired,
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string.isRequired,
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string.isRequired,
  name: PropTypes.string,
  visibilityName: PropTypes.string.isRequired,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string.isRequired,
  learningGoal: PropTypes.string,
  visibilityLearningGoal: PropTypes.string,
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isLoadingProfile: PropTypes.bool.isRequired,
  photoUploadError: PropTypes.objectOf(PropTypes.string),
  fetchProfile: PropTypes.func.isRequired,
  saveProfile: PropTypes.func.isRequired,
  saveProfilePhoto: PropTypes.func.isRequired,
  deleteProfilePhoto: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  intl: intlShape.isRequired,
};

ProfilePage.defaultProps = {
  saveState: null,
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  yearOfBirth: 13,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  learningGoal: null,
  languageProficiencies: [],
  courseCertificates: null,
  requiresParentalConsent: null,
  dateJoined: null,
  visibilityLearningGoal: null,
};

export default connect(
  profilePageSelector,
  {
    fetchProfile,
    saveProfilePhoto,
    deleteProfilePhoto,
    saveProfile,
    openForm,
    closeForm,
    updateDraft,
  },
)(injectIntl(withParams(ProfilePage)));
