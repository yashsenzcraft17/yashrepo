import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EncryptStorage } from "encrypt-storage";
import { getLeadDetails } from "services/leadDetail";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import LeadDetailsAPIData from "components/LeadDetailsAPIData";

import { getWindowWidth } from "utils/window";

// import AddNewLead from "containers/AddNewLead";

import logo from "assets/images/TripListing/greaterThanSymbol.svg";
import goBackLogo from "assets/images/TripListing/goBack.svg";
import editable from "assets/images/LeadDetails/editable.svg";
import viewOnly from "assets/images/LeadDetails/viewOnly.svg";

import "containers/LeadDetails/leadDetails.scss";
import { useParams } from "react-router-dom";

const LeadDetails = () => {
  const [storeLeadData, setStoreLeadData] = useState([]);
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { record_id: recordId } = useParams();

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  // EncryptStorage
  const token = encryptStorage.getItem("authToken");

  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;

  // makeAPICall
  useEffect(() => {
    const fetchLeadData = async () => {
      const response = await getLeadDetails(
        {
          email: data.email,
          role_id: String(data.role_id),
          record_id: String(recordId)
        },
        token
      );

      if (response?.status === 200) {
        encryptStorage?.setItem("authToken", response?.data?.token);
        setStoreLeadData(response?.data?.data);

        // Set isFieldsDisabled based on lead status
        setIsFieldsDisabled(
          response?.data?.data?.lead_status === "Rejected" ||
            response?.data?.data?.lead_status === "Posted"
        );

        setLoading(false);
      }

      if (response?.response?.status === 401) {
        toast.error(
          <>
            <span className="formAPIError">
              {response?.response?.data?.err_msg}
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
        navigate("/", { replace: true });
      }

      setLoading(false);
    };

    fetchLeadData();
  }, [recordId]);
  return (
    <div>
      <div
        // style={{paddingBottom: storeLeadData?.lead_status === "Rejected" ? "46px" : "0"}}
        className={
          storeLeadData?.lead_status === "Rejected" ||
          storeLeadData?.lead_status === "Posted"
            ? "leadMobileData"
            : "lead"
        }
      >
        {/* responsive */}
        <div className="leadDetailsBreadCrumbMobile">
          <Link to={"/marketing-lead-listing"}>
            <img src={goBackLogo} alt="goBackLogo" />
          </Link>
          <h4>Lead Details</h4>

          {storeLeadData?.lead_status === "Pending Review" ||
          storeLeadData?.lead_status === "Existing" ? (
            <div className="leadDetailsBreadCrumbMobileStatus">
              <img src={editable} alt="Editable" />
              <h3>Editable</h3>
            </div>
          ) : (
            <div className="leadDetailsBreadCrumbMobileStatus">
              <img src={viewOnly} alt="viewOnly" />
              <h3>View Only</h3>
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="leadDetailsBreadCrumb">
          <div className="leadDetailsBreadCrumbContent">
            <Link to={"/marketing-lead-listing"}>
              <span className="leadDetailsBreadCrumbData">Lead Listing</span>
            </Link>
            <img src={logo} alt="logo" />
            <label className="leadDetailsBreadCrumbContentLabel">
              Lead Details
            </label>
          </div>

          <div className="leadDetailsBreadCrumbPara">
            <p>Lead Details</p>

            {storeLeadData?.lead_status === "Pending Review" ||
            storeLeadData?.lead_status === "Existing" ? (
              <div className="leadDetailsBreadCrumbParaImage">
                <img src={editable} alt="Editable" />
                <h3>Editable</h3>
              </div>
            ) : (
              <div
                className="leadDetailsBreadCrumbParaImage"
                style={{ cursor: "default" }}
              >
                <img src={viewOnly} alt="viewOnly" />
                <h3>View Only</h3>
              </div>
            )}
          </div>
        </div>

        <LeadDetailsAPIData
          storeLeadData={storeLeadData}
          loading={loading}
          setLoading={setLoading}
          isFieldsDisabled={isFieldsDisabled}
        />

        {/* {window.location.pathname === "/marketing-lead-listing/lead" && (
          <AddNewLead />
        )} */}
      </div>
    </div>
  );
};

export default LeadDetails;
