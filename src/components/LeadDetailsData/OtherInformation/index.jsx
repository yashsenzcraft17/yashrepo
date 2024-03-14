import LeadDetailsCard from "components/LeadDetailsCard";
import Input from "components/FormElements/Input";
import Select from "components/FormElements/CustomSelect";
import Skeleton from "components/Skeleton";

import "components/LeadDetailsData/OtherInformation/otherInformation.scss";

import otherInfoLogo from "assets/images/LeadDetails/otherInfoLogo.svg";
import warningLogo from "assets/images/login/Warning.svg";
import { useEffect, useState } from "react";

const OtherInformation = ({
  leadData,
  loading,
  isFieldsDisabled,
  selectedDropdown,
  setIsActive,
  isActive,
  setIsActiveId,
  isActiveId,
  errorField,
  formValues,
  storeLeadData,
  handleChange,
  selectedRecordList,
  selectedRejectReason
}) => {
  // const hearAboutUsData = selectedDropdown?.awareness_info?.data || [];
  // const hearAboutUs = ["Please Select...", ...hearAboutUsData];

  const hearAboutUs = selectedDropdown?.awareness_info?.data || [];

  const [leadOptions, setLeadOptions] = useState([]);

  useEffect(() => {
    if (selectedRecordList?.lead_owner) {
      // const options = [
      //   "Please Select...",
      //   ...Object.keys(selectedRecordList.lead_owner)
      // ];

      const options = [...Object.keys(selectedRecordList.lead_owner)];

      setLeadOptions(options);
    }
  }, [selectedRecordList]);

  const leadReject = selectedRejectReason?.map(([_, value]) => value) || [];
  // leadReject.unshift("Please Select...");

  return (
    <>
      <LeadDetailsCard
        image={otherInfoLogo}
        title={"Other Information"}
        showCircle={false}
        setIsActive={setIsActive}
        isActive={isActive}
        setIsActiveId={setIsActiveId}
        isActiveId={isActiveId}
        commonId="3"
      >
        <div className="companyInfo">
          <div className="companyInfoTwoFields">
            {loading ? (
              <Skeleton width={"800px"} height={"44"} />
            ) : (
              <Select
                title="Lead Owner"
                name="lead_owner"
                keyValue={`abc${formValues?.lead_owner}`}
                disabled={isFieldsDisabled}
                value={formValues?.lead_owner || ""}
                selectedRecordList={selectedRecordList}
                options={leadOptions}
                storeLeadData={storeLeadData}
                text="Select Lead Owner"
                handleChange={(e) => handleChange(e, "lead_owner")}
              />
            )}

            {loading ? (
              <Skeleton width={"800px"} height={"44"} />
            ) : (
              <Input
                type="text"
                name="distributor_name"
                title="Distributor Name"
                disabled={isFieldsDisabled}
                value={formValues?.distributor_name || ""}
                text="Distributor Name"
                handleChange={(e) => handleChange(e, "distributor_name")}
                storeLeadData={storeLeadData}
                keyValue={`abc${formValues?.distributor_name}`}
              />
            )}
          </div>

          <div className="otherInfoFields">
            {loading ? (
              <Skeleton width={"800px"} height={"44"} />
            ) : (
              <Input
                type="text"
                name="site_location"
                title="Site Location"
                disabled={isFieldsDisabled}
                value={formValues?.site_location || ""}
                text="Site Location"
                handleChange={(e) => handleChange(e, "site_location")}
                storeLeadData={storeLeadData}
                keyValue={`abc${formValues?.site_location}`}
              />
            )}

            {loading ? (
              <Skeleton width={"800px"} height={"44"} />
            ) : (
              <div className="contactInfoPosition">
                <Select
                  title={
                    <span>
                      Where did you hear about us?
                      <span className="otherInfoAsterisk">*</span>
                    </span>
                  }
                  storeLeadData={storeLeadData}
                  name="hear_about_us"
                  keyValue={`abc${formValues?.hear_about_us}`}
                  value={formValues?.hear_about_us || ""}
                  options={hearAboutUs}
                  disabled={isFieldsDisabled}
                  text="Source"
                  handleChange={(e) => handleChange(e, "hear_about_us")}
                />

                {(formValues?.hear_about_us === "Please Select..." ||
                  !formValues?.hear_about_us?.length) &&
                  errorField?.includes("hear_about_us") && (
                    <div className="formOTPErrors">
                      <img src={warningLogo} alt="warningLogo" />
                      <p>Select where you hear about us</p>
                    </div>
                  )}
              </div>
            )}

            {loading ? (
              <Skeleton width={"800px"} height={"44"} />
            ) : (
              <div className="contactInfoPosition">
                <Input
                  title={
                    <span>
                      Lead Source
                      <span className="otherInfoAsterisk">*</span>
                    </span>
                  }
                  name="other_lead_source"
                  value={formValues?.other_lead_source || ""}
                  storeLeadData={storeLeadData}
                  // options={source}
                  disabled={isFieldsDisabled}
                  text="Lead Source"
                  handleChange={(e) => handleChange(e, "other_lead_source")}
                  keyValue={`abc${formValues?.other_lead_source}`}
                />
                {/* <Select
                  title={
                    <span>
                      Lead Source
                      <span className="otherInfoAsterisk">*</span>
                    </span>
                  }
                  name="other_lead_source"
                  value={formValues?.other_lead_source}
                  storeLeadData={storeLeadData}
                  options={source}
                  disabled={isFieldsDisabled}
                  text="Lead Source"
                  handleChange={(e) => handleChange(e, "other_lead_source")}
                /> */}
                {!formValues?.other_lead_source?.length &&
                  errorField?.includes("other_lead_source") && (
                    <div className="formOTPErrors">
                      <img src={warningLogo} alt="warningLogo" />
                      <p>Enter a lead source</p>
                    </div>
                  )}
              </div>
            )}

            {/* {loading ? (
              <Skeleton width={"800px"} height={"44"} />
            ) : (
              <Select
                title="Captured Lead Status"
                name="lead_erp_status"
                value={formValues?.lead_status || ""}
                disabled={isFieldsDisabled || true}
                options={status}
                storeLeadData={storeLeadData}
                text="Select"
                handleChange={(e) => handleChange(e, "lead_erp_status")}
                keyValue={`abc${formValues?.lead_erp_status}`}
              />
            )} */}

            {loading ? (
              <Skeleton width={"800px"} height={"44"} />
            ) : (
              <div className="contactInfoPosition">
                <Select
                  title={
                    <span>
                      Captured Lead Reject Reason
                      {/* <span className="otherInfoAsterisk">*</span> */}
                    </span>
                  }
                  name="reject_reason"
                  disabled={isFieldsDisabled}
                  value={formValues?.reject_reason || ""}
                  keyValue={`abc${formValues?.reject_reason}`}
                  options={leadReject}
                  text="Lead Reject Reason"
                  handleChange={(e) => handleChange(e, "reject_reason")}
                  storeLeadData={storeLeadData}
                />
                {/* {!formValues?.reject_reason?.length &&
                  errorField?.includes("reject_reason") && (
                    <div className="formOTPErrors">
                      <img src={warningLogo} alt="warningLogo" />
                      <p>Select a rejectReason</p>
                    </div>
                  )} */}
              </div>
            )}

            {loading ? (
              <Skeleton width={"800px"} height={"44"} />
            ) : (
              <Input
                type="text"
                name="reject_detail"
                title="Captured Lead Reject Reason Detail"
                value={formValues?.reject_detail || ""}
                disabled={
                  isFieldsDisabled || !formValues?.reject_reason?.length
                }
                text="Reject Reason Detail"
                handleChange={(e) => handleChange(e, "reject_detail")}
                storeLeadData={storeLeadData}
                keyValue={`abc${formValues?.reject_detail}`}
              />
            )}
          </div>
        </div>

        {loading ? (
          <Skeleton width={"800px"} height={"44"} />
        ) : (
          <>
            <label className="otherInfoText">Remarks</label>

            <textarea
              placeholder="Remarks"
              className="otherInfoTextArea"
              name="remarks"
              value={formValues?.remarks || ""}
              onChange={(e) => handleChange(e, "remarks")}
              // key={`abc${formValues?.remarks}`}
              disabled={isFieldsDisabled}
            ></textarea>
          </>
        )}
      </LeadDetailsCard>
    </>
  );
};

export default OtherInformation;
