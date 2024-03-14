import React from "react";
// import { format, parseISO } from "date-fns";

import StatusTag from "components/StatusTag";

// import Arrow from "assets/images/header/downArrow.svg";

import "components/LeadListTableMobile/leadListTableMobile.scss";

const LeadlistTableMobile = ({ data, handleClick }) => {
  // const formattedDate = (dateString) => {
  //   const date = parseISO(dateString);
  //   return format(date, "dd MMM yyyy");
  // };

  // Example usage:
  // const formatted = formattedDate(data?.contacted_date);

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="leadListMobileTableData">
      <div className="leadListMobileTableDataContent">
        {/* <div className="tripListMobileTableDataRoute">
            <h3>Route Code</h3>
            <p>{data?.route_code}</p>
          </div> */}

        <div className="leadListMobileTableDataRoute">
          <h3>{data?.company}</h3>
          {/* <p>#{data?.trip_id.substr(data?.trip_id.length - 4)}</p> */}
        </div>

        <div className="leadListMobileTableDataStatus">
          <StatusTag value={data.status} />
          {/* <img src={Arrow} alt="Arrow" /> */}
        </div>
      </div>
      <div className="leadListMobileTableDataCards">
        <div className="leadListCard">
          <p>Record Type</p>
          <span>{truncateText(data?.lead_type, 15)}</span>
        </div>
        <div className="leadListCard">
          <p>Date Created</p>
          <span>{data?.contacted_date?.slice(0, 10) || ""}</span>
        </div>
        <div className="leadListCard">
          <p>Name</p>
          <span>{data?.name}</span>
        </div>
        <div className="leadListCard">
          <p>E-mail</p>
          <span>{truncateText(data?.email, 13)}</span>
        </div>
        <div className="leadListCard">
          <p>Mobile</p>
          <span>{data?.mobile}</span>
        </div>
        <div className="leadListCard">
          <p>Country</p>
          <span>{data?.country}</span>
        </div>
        <div className="leadListCard">
          <p>Channel</p>
          <span>{data?.channel}</span>
        </div>
      </div>
      <button onClick={() => handleClick(data?.record_id, "LEAD_MOBILE")}>
        Edit Details
      </button>
    </div>
  );
};

export default LeadlistTableMobile;
