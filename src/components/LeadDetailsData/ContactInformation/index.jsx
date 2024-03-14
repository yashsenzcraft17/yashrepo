import Input from "components/FormElements/Input";
import Skeleton from "components/Skeleton";
import LeadDetailsCard from "components/LeadDetailsCard";
import Select from "components/FormElements/CustomSelect";

import callLogo from "assets/images/LeadDetails/call.svg";
import warningLogo from "assets/images/login/Warning.svg";

import "components/LeadDetailsData/ContactInformation/contactInformation.scss";

import useScreenMobile from "hooks/useScreenMobile";

const ContactInformation = ({
  leadData,
  loading,
  isFieldsDisabled,
  handleChange,
  errorField,
  formValues,
  handleBlur,
  handleFocus,
  setIsActive,
  isActive,
  setIsActiveId,
  storeLeadData,
  emailError,
  isActiveId,
  selectedDropdown
}) => {
  const isMobile = useScreenMobile({ size: 768 });
  const designationOptions = selectedDropdown?.designation?.data || [];

  return (
    <>
      <LeadDetailsCard
        image={callLogo}
        leadData={leadData}
        title={isMobile ? "Contact info" : "Contact Information"}
        setIsActive={setIsActive}
        isActive={isActive}
        setIsActiveId={setIsActiveId}
        isActiveId={isActiveId}
        commonId="1"
      >
        <div className="contactInfo">
          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <div className="contactInfoPosition">
              <Input
                type="text"
                name="first_name"
                text="First Name"
                title={
                  <span>
                    First Name <span className="otherInfoAsterisk">*</span>
                  </span>
                }
                value={formValues?.first_name || ""}
                disabled={isFieldsDisabled}
                handleChange={(e) => handleChange(e, "first_name")}
                storeLeadData={storeLeadData}
                keyValue={`abc${formValues?.first_name}`}
                // error={errorField?.includes("firstName")}
              />
              {!formValues?.first_name?.length &&
                errorField?.includes("first_name") && (
                  <div className="formOTPErrors">
                    <img src={warningLogo} alt="warningLogo" />
                    <p>Enter your first name</p>
                  </div>
                )}
            </div>
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <div className="contactInfoPosition">
              <Input
                type="text"
                name="last_name"
                text="Last Name"
                title={
                  <span>
                    Last Name <span className="otherInfoAsterisk">*</span>
                  </span>
                }
                storeLeadData={storeLeadData}
                value={formValues?.last_name || ""}
                disabled={isFieldsDisabled}
                handleChange={(e) => handleChange(e, "last_name")}
                keyValue={`abc${formValues?.last_name}`}
                // handleFocus={handleFocus}
                // error={errorField?.includes("lastName")}
              />
              {!formValues?.last_name?.length &&
                errorField?.includes("last_name") && (
                  <div className="formOTPErrors">
                    <img src={warningLogo} alt="warningLogo" />
                    <p>Enter your last name</p>
                  </div>
                )}
            </div>
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            // <Input
            //   type="text"
            //   name="designation"
            //   title="Designation"
            //   text="Designation"
            //   disabled={isFieldsDisabled}
            //   storeLeadData={storeLeadData}
            //   value={formValues?.designation || ""}
            //   keyValue={`abc${formValues?.designation}`}
            //   // handleFocus={handleFocus}
            //   handleChange={(e) => handleChange(e, "designation")}
            // />
            <Select
              title="Designation"
              text="Select Designation"
              name="designation"
              value={formValues?.designation || ""}
              options={designationOptions}
              storeLeadData={storeLeadData}
              disabled={isFieldsDisabled}
              handleChange={(e) => handleChange(e, "designation")}
              keyValue={`abc${formValues?.designation}`}
            />
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <div className="contactInfoPosition">
              <Input
                type="email"
                name="email"
                text="Email"
                title={
                  <span>
                    E-mail <span className="otherInfoAsterisk">*</span>
                  </span>
                }
                storeLeadData={storeLeadData}
                value={formValues?.email || ""}
                disabled={isFieldsDisabled}
                keyValue={`abc${formValues?.email}`}
                handleChange={(e) => handleChange(e, "email")}
                handleFocus={handleFocus}
                // error={errorField?.includes("email")}
                // onBlur={handleBlur}
              />
              {!formValues?.email?.length && errorField?.includes("email") && (
                <div className="formOTPErrors">
                  <img src={warningLogo} alt="warningLogo" />
                  <p>Please enter an email</p>
                </div>
              )}
              {emailError && (
                <div className="formOTPErrors">
                  <img src={warningLogo} alt="warningLogo" />
                  <p>Please enter a valid email</p>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <Input
              type="string"
              text="Phone Number"
              name="phone"
              title="Phone"
              // disabled={isFieldsDisabled || true}
              disabled={isFieldsDisabled}
              handleChange={(e) => handleChange(e, "phone")}
              keyValue={`abc${formValues?.phone}`}
              storeLeadData={storeLeadData}
              value={formValues?.phone || ""}
            />
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <div className="contactInfoPosition">
              <Input
                type="string"
                name="mobile"
                text="Mobile number"
                title={
                  <span>
                    Mobile <span className="otherInfoAsterisk">*</span>
                  </span>
                }
                disabled={isFieldsDisabled}
                value={formValues?.mobile || ""}
                handleChange={(e) => handleChange(e, "mobile")}
                storeLeadData={storeLeadData}
                keyValue={`abc${formValues?.mobile}`}
                // handleFocus={handleFocus}
                // error={errorField?.includes("mobile")}
              />
              {!formValues?.mobile?.length &&
                errorField?.includes("mobile") && (
                  <div className="formOTPErrors">
                    <img src={warningLogo} alt="warningLogo" />
                    <p>Please enter your mobile number</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </LeadDetailsCard>
    </>
  );
};

export default ContactInformation;
