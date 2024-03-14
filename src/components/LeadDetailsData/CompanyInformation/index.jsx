import { useEffect, useState } from "react";

import LeadDetailsCard from "components/LeadDetailsCard";
import Input from "components/FormElements/Input";
import Select from "components/FormElements/CustomSelect";
import Skeleton from "components/Skeleton";

import "components/LeadDetailsData/CompanyInformation/companyInformation.scss";

import companyLogo from "assets/images/LeadDetails/companyLogo.svg";
import warningLogo from "assets/images/login/Warning.svg";
// import { useState } from "react";

const CompanyInformation = ({
  leadData,
  loading,
  isFieldsDisabled,
  selectedDropdown,
  setIsActive,
  isActive,
  setIsActiveId,
  isActiveId,
  handleChange,
  errorField,
  formValues,
  storeLeadData,
  setFormValues,
  render
}) => {
  // const countryOptionsData = selectedDropdown?.country?.data || [];
  // const countryOptions = ["Please Select...", ...countryOptionsData];

  const countryOptions = selectedDropdown?.country?.data || [];

  // const industryOptionsData = selectedDropdown?.industry?.data || [];
  // const industryOptions = ["Please Select...", ...industryOptionsData];

  const industryOptions = selectedDropdown?.industry?.data || [];

  // const stateOptions = selectedDropdown?.state || [];
  // const zoneOptions = selectedDropdown?.zone || [];

  // const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);

  useEffect(() => {
    if (formValues) {
      setSelectedState([]);

      const selectedCountryStates =
        selectedDropdown?.state?.[formValues?.country] || [];
      setSelectedState(selectedCountryStates);

      const selectedCountryZones =
        selectedDropdown?.zone?.[formValues?.state] || [];

      setSelectedZone(selectedCountryZones);
      // Reset state and zone when country changes
      if (selectedCountryZones?.length === 1) {
        setFormValues((prev) => ({
          ...prev,
          company_info: {
            ...prev["company_info"],
            zone: selectedCountryZones[0]
          }
        }));
      } else {
        setFormValues((prev) => ({
          ...prev,
          company_info: {
            ...prev["company_info"]
            // state: "",
            // zone: "" // Reset zone if there are multiple zones or no zones
          }
        }));
      }
    }
  }, [formValues?.country, formValues?.state, selectedDropdown]);

  return (
    <>
      <LeadDetailsCard
        image={companyLogo}
        title={"Company Information"}
        showCircle={false}
        setIsActive={setIsActive}
        isActive={isActive}
        setIsActiveId={setIsActiveId}
        isActiveId={isActiveId}
        commonId="2"
      >
        <div className="companyInfo">
          <div className="companyInfoTwoFields">
            {loading ? (
              <Skeleton width={"227px"} height={"44"} />
            ) : (
              <div className="contactInfoPosition">
                <Input
                  type="text"
                  name="company"
                  text="Company"
                  title={
                    <span>
                      Company <span className="otherInfoAsterisk">*</span>
                    </span>
                  }
                  value={formValues?.company || ""}
                  disabled={isFieldsDisabled}
                  handleChange={(e) => handleChange(e, "company")}
                  storeLeadData={storeLeadData}
                  keyValue={`abc${formValues?.company}`}
                />
                {!formValues?.company?.length &&
                  errorField?.includes("company") && (
                    <div className="formOTPErrors">
                      <img src={warningLogo} alt="warningLogo" />
                      <p>Enter your company name</p>
                    </div>
                  )}
              </div>
            )}

            {loading ? (
              <Skeleton width={"227px"} height={"44"} />
            ) : (
              <Select
                title="Industry"
                text="Select Industry"
                name="industry"
                value={formValues?.industry || ""}
                options={industryOptions}
                storeLeadData={storeLeadData}
                disabled={isFieldsDisabled}
                handleChange={(e) => handleChange(e, "industry")}
                keyValue={`abc${formValues?.industry}`}
              />
            )}
          </div>

          <div className="companyInfoFields">
            {loading ? (
              <Skeleton width={"227px"} height={"44"} />
            ) : (
              <Input
                type="text"
                name="street"
                title="Street/Building"
                text="Street/Building"
                disabled={isFieldsDisabled}
                value={formValues?.street || ""}
                storeLeadData={storeLeadData}
                handleChange={(e) => handleChange(e, "street")}
                keyValue={`abc${formValues?.street}`}
              />
            )}

            {loading ? (
              <Skeleton width={"227px"} height={"44"} />
            ) : (
              <Input
                type="text"
                name="city"
                text="City"
                title="City"
                disabled={isFieldsDisabled}
                value={formValues?.city || ""}
                handleChange={(e) => handleChange(e, "city")}
                storeLeadData={storeLeadData}
                keyValue={`abc${formValues?.city}`}
              />
            )}

            {loading ? (
              <Skeleton width={"227px"} height={"44"} />
            ) : (
              <Input
                type="number"
                name="zip"
                text="Zip Code"
                title="Zip code"
                disabled={isFieldsDisabled}
                value={formValues?.zip || ""}
                handleChange={(e) => handleChange(e, "zip")}
                storeLeadData={storeLeadData}
                keyValue={`abc${formValues?.zip}`}
              />
            )}

            {loading ? (
              <Skeleton width={"227px"} height={"44"} />
            ) : (
              <div className="contactInfoPosition">
                <Select
                  text="Select Country"
                  title={
                    <span>
                      Country <span className="otherInfoAsterisk">*</span>
                    </span>
                  }
                  storeLeadData={storeLeadData}
                  keyValue={`abc${formValues?.country}`}
                  name="country"
                  value={formValues?.country || ""}
                  options={countryOptions}
                  disabled={isFieldsDisabled}
                  handleChange={(e) => handleChange(e, "country")}
                />
                {formValues?.country === "Please Select..." ||
                  (!formValues?.country?.length &&
                  errorField?.includes("country") ? (
                    <div className="formOTPErrors">
                      <img src={warningLogo} alt="warningLogo" />
                      <p>Select a country</p>
                    </div>
                  ) : (
                    ""
                  ))}
              </div>
            )}

            {loading ? (
              <Skeleton width={"227px"} height={"44"} />
            ) : (
              <div className="contactInfoPosition">
                <Select
                  title={
                    <span>
                      State <span className="otherInfoAsterisk">*</span>
                    </span>
                  }
                  keyValue={`abc${formValues?.state}`}
                  name="state"
                  text="Select State"
                  storeLeadData={storeLeadData}
                  value={formValues?.state || ""}
                  options={selectedState}
                  handleChange={(e) => handleChange(e, "state")}
                  disabled={
                    isFieldsDisabled ||
                    !formValues?.country?.length ||
                    formValues?.country === "Please Select..."
                  }
                />
                {!formValues?.state?.length &&
                  errorField?.includes("state") && (
                    <div className="formOTPErrors">
                      <img src={warningLogo} alt="warningLogo" />
                      <p>Select a state</p>
                    </div>
                  )}
              </div>
            )}

            {loading ? (
              <Skeleton width={"227px"} height={"44"} />
            ) : (
              <div className="contactInfoPosition">
                {/* <Select
                  title={
                    <span>
                      Geographic Zone{" "}
                      <span className="otherInfoAsterisk">*</span>
                    </span>
                  }
                  key={`abc${formValues?.zone}`}
                  name="zone"
                  text="Select Zone"
                  value={formValues?.zone}
                  storeLeadData={storeLeadData}
                  // options={Object.entries(zoneOptions).flatMap(
                  //   ([country, directions]) =>
                  //     directions.map((direction) => `${direction}`)
                  // )}
                  options={selectedZone}
                  handleChange={(e) => handleChange(e, "zone")}
                  disabled={isFieldsDisabled || !formValues?.state?.length}
                /> */}
                <Input
                  title={
                    <span>
                      Geographic Zone{" "}
                      {/* <span className="otherInfoAsterisk">*</span> */}
                    </span>
                  }
                  keyValue={`abc${formValues?.zone}`}
                  name="zone"
                  text="Select Zone"
                  value={formValues?.zone || selectedZone}
                  storeLeadData={storeLeadData}
                  handleChange={(e) => handleChange(e, "zone")}
                  disabled={isFieldsDisabled || !formValues?.state?.length}
                />
                {/* {!formValues?.zone?.length && errorField?.includes("zone") && (
                  <div className="formOTPErrors">
                    <img src={warningLogo} alt="warningLogo" />
                    <p>Select a zone</p>
                  </div>
                )} */}
              </div>
            )}
          </div>
        </div>
      </LeadDetailsCard>
    </>
  );
};

export default CompanyInformation;
