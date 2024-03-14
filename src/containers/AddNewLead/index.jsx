import { Link } from "react-router-dom";
import useScreenMobile from "hooks/useScreenMobile";

import LeadDataButton from "components/LeadDataButton";
import CommunicationInfo from "components/LeadDetailsData/CommunicationInfo";
import CompanyInformation from "components/LeadDetailsData/CompanyInformation";
import ContactInformation from "components/LeadDetailsData/ContactInformation";
import OtherInformation from "components/LeadDetailsData/OtherInformation";
import ProductInterest from "components/LeadDetailsData/ProductInterest";
import LeadStatusCard from "components/LeadStatusCard";

import logo from "assets/images/TripListing/greaterThanSymbol.svg";
import goBackLogo from "assets/images/TripListing/goBack.svg";
import viewOnly from "assets/images/LeadDetails/viewOnly.svg";

import "containers/AddNewLead/addNewLead.scss";

const AddNewLead = () => {
  const isMobile = useScreenMobile({ size: 768 });

  return (
    <div className="addNewLead">
      {/* responsive */}
      <div className="leadDetailsBreadCrumbMobile">
        <Link to={"/marketing-lead-listing"}>
          <img src={goBackLogo} alt="goBackLogo" />
        </Link>
        <h4>Lead Details</h4>

        <div className="leadDetailsBreadCrumbMobileStatus">
          <img src={viewOnly} alt="viewOnly" />
          <h3>View Only</h3>
        </div>
      </div>

      {/* Desktop */}
      <div className="leadDetailsBreadCrumb">
        <div className="leadDetailsBreadCrumbContent">
          <Link to={"/marketing-lead-listing"}>
            <span className="leadDetailsBreadCrumbData">Lead Listing</span>
          </Link>
          <img src={logo} alt="logo" />
          <label className="leadDetailsBreadCrumbContentLabel">
            Add New Lead
          </label>
        </div>

        <div className="leadDetailsBreadCrumbPara">
          <p>Add New Lead</p>
        </div>
      </div>

      <div className="leadAllCards">
        <div>
          <div className="leadAllCardsInfo">
            <LeadStatusCard />

            <ContactInformation />
            <CompanyInformation />
            <ProductInterest />
            <OtherInformation />
          </div>

          <div className={isMobile ? "leadMobileBtn" : "leadButtons"}>
            <LeadDataButton />
          </div>
        </div>

        <div className="leadAllCardsCommunicationInfo">
          <CommunicationInfo />
        </div>
      </div>
    </div>
  );
};

export default AddNewLead;
