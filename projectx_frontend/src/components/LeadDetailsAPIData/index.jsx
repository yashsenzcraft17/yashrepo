import { EncryptStorage } from "encrypt-storage";
import useScreenMobile from "hooks/useScreenMobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import LeadDataButton from "components/LeadDataButton";
import CommunicationInfo from "components/LeadDetailsData/CommunicationInfo";
import CompanyInformation from "components/LeadDetailsData/CompanyInformation";
import ContactInformation from "components/LeadDetailsData/ContactInformation";
import OtherInformation from "components/LeadDetailsData/OtherInformation";
import ProductInterest from "components/LeadDetailsData/ProductInterest";
import LeadStatusCard from "components/LeadStatusCard";

import "containers/LeadDetails/leadDetails.scss";
import "react-toastify/dist/ReactToastify.css";

import {
  getLeadDetailUpdateFlag,
  getLeadDetailUpdateLead,
  getLeadDetailsList,
  getLeadDetailsRecordList,
  getLeadRejectReason
} from "services/leadDetail";
import { getWindowWidth } from "utils/window";

const LeadDetailsAPIData = ({
  storeLeadData,
  loading,
  isFieldsDisabled,
  id,
  setLoading
}) => {
  const isMobile = useScreenMobile({ size: 768 });
  const [selectedDropdown, setSelectedDropdown] = useState([]);
  const [selectedRecordList, setSelectedRecordList] = useState([]);
  const [selectedRejectReason, setSelectedRejectReason] = useState([]);
  const [updateFlagId, setUpdateFlagId] = useState(null);
  const [changeFieldsData, setChangeFieldsData] = useState({});

  const [updateFlag, setUpdateFlag] = useState([]);

  const [emailError, setEmailError] = useState(false);

  const [formValues, setFormValues] = useState({});

  const [errorField, setErrorField] = useState([]);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    id: formValues?.other_info?.lead_type || ""
  });

  const [requiredFields] = useState([
    "first_name",
    "last_name",
    "email",
    "mobile",
    "company",
    "country",
    "state",
    "zone",
    "other_lead_source",
    "hear_about_us"
  ]);

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  // EncryptStorage
  const token = encryptStorage.getItem("authToken");

  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;

  const navigate = useNavigate();

  // makeAPICall
  useEffect(() => {
    const fetchLeadDetailsList = async () => {
      const response = await getLeadDetailsList(
        {
          email: data.email
        },
        token
      );

      if (response?.status === 200) {
        setSelectedDropdown(response?.data?.data?.picklist);
      }
    };

    const fetchLeadDetailsRecordList = async () => {
      const response = await getLeadDetailsRecordList(
        {
          email: data.email
        },
        token
      );

      if (response?.status === 200) {
        setSelectedRecordList(response?.data?.data?.recordtype);
      }
    };

    const fetchLeadRejectReason = async () => {
      const response = await getLeadRejectReason(
        {
          email: data.email
        },
        token
      );

      if (response?.status === 200) {
        setSelectedRejectReason(response?.data?.data?.lead_reject_reason_list);
      }
    };

    const fetchLeadUpdateFlag = async () => {
      const response = await getLeadDetailUpdateFlag(
        {
          email: data.email
        },
        token
      );

      if (response?.status === 200) {
        setUpdateFlag(response?.data?.data?.request_update_flag_list);
      }
    };

    if (updateFlagId !== null) {
      const fetchUpdateLead = async () => {
        const response = await getLeadDetailUpdateLead(
          {
            email: data.email,
            lead_details: {
              key_info: {
                record_id: storeLeadData?.record_id,
                lead_product_interest_id:
                  storeLeadData?.lead_product_interest_id
              },
              ...changeFieldsData
            },
            update_flag: updateFlagId,
            role_id: data?.role_id
          },

          token
        );
        if (updateFlagId === "0") {
          if (response?.status === 200) {
            navigate("/marketing-lead-listing");
            localStorage.removeItem("multiselectValue");
            localStorage.removeItem("filterData");
            localStorage.removeItem("status");
            toast.success(
              <>
                <span className="formSuccessMsg">
                  Lead information saved as draft
                </span>
              </>,
              {
                position:
                  getWindowWidth() <= 768
                    ? toast.POSITION.BOTTOM_CENTER
                    : toast.POSITION.TOP_RIGHT,
                toastId: "1"
              }
            );
          }
        }
        if (updateFlagId === "1") {
          if (response?.status === 200) {
            navigate("/marketing-lead-listing");
            localStorage.removeItem("multiselectValue");
            localStorage.removeItem("filterData");
            localStorage.removeItem("status");
            toast.success(
              <>
                <span className="formSuccessMsg">
                  Successfully posted to CRM
                </span>
              </>,
              {
                position:
                  getWindowWidth() <= 768
                    ? toast.POSITION.BOTTOM_CENTER
                    : toast.POSITION.TOP_RIGHT,
                toastId: "1"
              }
            );
          }
        } else {
          if (response?.status === 200) {
            navigate("/marketing-lead-listing");
            localStorage.removeItem("multiselectValue");
            localStorage.removeItem("filterData");
            localStorage.removeItem("status");
          }
        }

        if (response?.response?.status === 500) {
          toast.error(
            <>
              <span className="formAPIError">Something went wrong</span>
            </>,
            {
              position:
                getWindowWidth() <= 768
                  ? toast.POSITION.BOTTOM_CENTER
                  : toast.POSITION.TOP_RIGHT,
              toastId: "1"
            }
          );
        }

        if (response?.status === 401) {
          toast.error(
            <>
              <span className="formAPIError">
                {response?.data?.err_msg ||
                  "Session Expired, Redirecting to login page"}
              </span>
            </>,
            {
              position:
                getWindowWidth() <= 768
                  ? toast.POSITION.BOTTOM_CENTER
                  : toast.POSITION.TOP_RIGHT,
              toastId: "abc"
            }
          );
          localStorage.clear();
          navigate("/");
        }
        setLoading(false);
        setTriggerEffect(false);
      };

      fetchUpdateLead();
    }
    fetchLeadUpdateFlag();
    fetchLeadDetailsList();
    fetchLeadDetailsRecordList();
    fetchLeadRejectReason();
  }, [updateFlagId, triggerEffect]);

  useEffect(() => {
    /* eslint-disable */
    if (storeLeadData) {
      const { company_info, contact_info, other_info, product_interest } =
        storeLeadData;
      setFormValues({
        company_info,
        contact_info,
        other_info,
        product_interest
      });
      /* eslint-enable */
    }
  }, [storeLeadData]);

  const handleChange = (event, fieldName, key) => {
    const { value } = event?.target ?? event;

    // if (value === "Please Select...") {
    //   return;
    // }

    setFormValues({
      ...formValues,
      [key]: { ...formValues[key], [fieldName]: value }
    });
    if (fieldName === "reject_reason" && value === "") {
      setFormValues({
        ...formValues,
        [key]: { ...formValues[key], reject_detail: "", reject_reason: "" }
      });
    }
    if (fieldName === "state" && value === "") {
      setFormValues({
        ...formValues,
        [key]: { ...formValues[key], state: "", zone: "" }
      });
    }
    errorField?.forEach((field) => {
      if (field === fieldName && value?.length) {
        setErrorField(errorField?.filter((e) => e !== fieldName));
      }
    });

    if (fieldName === "country") {
      if (formValues?.company_info?.state?.length) {
        setFormValues((pre) => {
          return {
            ...pre,
            company_info: {
              ...pre?.company_info,
              state: "",
              zone: ""
            }
          };
        });
      }
    }

    // Check for email format
    if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        // Set email error state
        setEmailError(true);
      } else {
        // Reset email error state
        setEmailError(false);
      }
    }
  };

  const handleSubmit = (values, status, id) => {
    const changedFields = {};
    compareAndStoreChangedFields(
      "contact_info",
      storeLeadData?.contact_info || {},
      formValues?.contact_info,
      changedFields
    );

    compareAndStoreChangedFields(
      "product_interest",
      storeLeadData?.product_interest || {},
      formValues?.product_interest,
      changedFields
    );

    compareAndStoreChangedFields(
      "company_info",
      storeLeadData?.company_info || {},
      formValues?.company_info,
      changedFields
    );

    compareAndStoreChangedFields(
      "other_info",
      storeLeadData?.other_info || {},
      {
        ...formValues?.other_info,
        lead_type: selectedOption.id
      },
      changedFields
    );
    // console.log(changedFields, "before");
    // Store changedFields in state
    if (id !== "-1") {
      Object?.keys?.(changedFields)?.forEach((field) => {
        Object?.keys?.(changedFields[field])?.forEach((key) => {
          if (changedFields[field][key] === "Please Select...") {
            delete changedFields[field][key];
          }
        });
      });
      // console.log(changedFields, "after");
      setChangeFieldsData(changedFields);

      const errorFields = [];
      requiredFields.forEach((e) => {
        Object?.values(formValues)?.forEach((data) => {
          if (Object?.keys(data)?.includes(e)) {
            if (!data[e]?.length || data[e] === "Please Select...")
              errorFields.push(e);
          }
        });
      });

      setErrorField(errorFields);
      if (errorFields?.length) {
        toast.error(
          <>
            <span className="formAPIError">Mandatory Information Missing</span>
          </>,
          {
            position:
              getWindowWidth() <= 768
                ? toast.POSITION.BOTTOM_CENTER
                : toast.POSITION.TOP_RIGHT,
            toastId: "1"
          }
        );
      }
      if (!errorFields?.length) {
        setUpdateFlagId(id);
        setTriggerEffect(true);
      }
    } else {
      Object?.keys?.(changedFields)?.forEach((field) => {
        Object?.keys?.(changedFields[field])?.forEach((key) => {
          if (changedFields[field][key] === "Please Select...") {
            delete changedFields[field][key];
          }
        });
      });
      setChangeFieldsData(changedFields);
      setUpdateFlagId(id);
    }
  };

  const compareAndStoreChangedFields = (
    section,
    originalData,
    formData,
    changedFields
  ) => {
    const sectionChangedFields = {};

    Object?.keys?.(originalData).forEach((field) => {
      const originalValue = getFieldNestedValue(originalData, field);
      const formValue = getFieldNestedValue(formData, field);

      if (originalValue !== formValue && formValue !== undefined) {
        setNestedField(sectionChangedFields, field, formValue);
      }
    });

    if (Object.keys(sectionChangedFields).length > 0) {
      changedFields[section] = sectionChangedFields;
    }
  };

  const getFieldNestedValue = (object, field) => {
    const fieldParts = field?.split(".");
    let value = object;

    for (const part of fieldParts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  };

  const setNestedField = (object, field, value) => {
    const fieldParts = field?.split(".");
    let nestedObject = object;

    for (let i = 0; i < fieldParts.length - 1; i++) {
      const part = fieldParts[i];
      nestedObject[part] = nestedObject[part] || {};
      nestedObject = nestedObject[part];
    }

    nestedObject[fieldParts[fieldParts.length - 1]] = value;
  };

  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [isActive, setIsActive] = useState(true);
  const [isActiveId, setIsActiveId] = useState("1");

  return (
    <div className="leadAllCards">
      <div>
        <div className="leadAllCardsInfo">
          <LeadStatusCard
            leadData={storeLeadData?.lead_status}
            selectedRecordList={selectedRecordList}
            isFieldsDisabled={isFieldsDisabled}
            formValues={formValues?.other_info}
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
          />

          <ContactInformation
            storeLeadData={storeLeadData}
            leadData={storeLeadData}
            loading={loading}
            isFieldsDisabled={isFieldsDisabled}
            handleChange={(e, fieldName) =>
              handleChange(e, fieldName, "contact_info")
            }
            errorField={errorField}
            formValues={formValues?.contact_info}
            setIsActive={setIsActive}
            isActive={isActive}
            setIsActiveId={setIsActiveId}
            isActiveId={isActiveId}
            emailError={emailError}
            selectedDropdown={selectedDropdown}
          />

          <CompanyInformation
            leadData={storeLeadData}
            loading={loading}
            storeLeadData={storeLeadData}
            isFieldsDisabled={isFieldsDisabled}
            selectedDropdown={selectedDropdown}
            setIsActive={setIsActive}
            isActive={isActive}
            setIsActiveId={setIsActiveId}
            isActiveId={isActiveId}
            handleChange={(e, fieldName) =>
              handleChange(e, fieldName, "company_info")
            }
            errorField={errorField}
            formValues={formValues?.company_info}
            setFormValues={setFormValues}
          />

          <ProductInterest
            leadData={storeLeadData?.product_interest}
            loading={loading}
            storeLeadData={storeLeadData}
            selectedDropdown={selectedDropdown}
            isFieldsDisabled={isFieldsDisabled}
            setIsActive={setIsActive}
            isActive={isActive}
            setIsActiveId={setIsActiveId}
            isActiveId={isActiveId}
            handleChange={(e, fieldName) =>
              handleChange(e, fieldName, "product_interest")
            }
            errorField={errorField}
            formValues={formValues?.product_interest}
          />

          <OtherInformation
            leadData={storeLeadData?.other_info}
            storeLeadData={storeLeadData}
            loading={loading}
            selectedDropdown={selectedDropdown}
            isFieldsDisabled={isFieldsDisabled}
            setIsActive={setIsActive}
            isActive={isActive}
            setIsActiveId={setIsActiveId}
            isActiveId={isActiveId}
            handleChange={(e, fieldName) =>
              handleChange(e, fieldName, "other_info")
            }
            errorField={errorField}
            formValues={formValues?.other_info}
            selectedRecordList={selectedRecordList}
            selectedRejectReason={selectedRejectReason}
          />
        </div>

        {(storeLeadData?.lead_status === "Pending Review" ||
          storeLeadData?.lead_status === "Existing") && (
          <div className={isMobile ? "leadMobileBtn" : "leadButtons"}>
            <LeadDataButton
              loading={loading}
              handleSubmit={handleSubmit}
              formValues={formValues?.other_info}
              updateFlag={updateFlag}
            />
          </div>
        )}
      </div>

      <div className="leadAllCardsCommunicationInfo">
        <CommunicationInfo
          leadData={storeLeadData}
          loading={loading}
          setIsActive={setIsActive}
          isActive={isActive}
          setIsActiveId={setIsActiveId}
          isActiveId={isActiveId}
        />
      </div>
    </div>
  );
};

export default LeadDetailsAPIData;
