import { format, isValid } from "date-fns";

import StatusTag from "components/StatusTag";

import inProgressRoute from "assets/images/TripListing/inProgressRoute.svg";
import completedRoute from "assets/images/TripListing/completedRoute.svg";
import scheduledRoute from "assets/images/TripListing/scheduledRoute.svg";

import "components/TripListTableMobile/tripListTableMobile.scss";

const TripListTableMobile = ({ data, handleClick }) => {
  // Ensure valid date values or set to null
  const startDate = data?.start_date ? new Date(data.start_date) : null;
  const endDate = data?.end_date ? new Date(data.end_date) : null;

  // Check if dates are valid
  const isStartDateValid = isValid(startDate);
  const isEndDateValid = isValid(endDate);

  // Format dates or handle invalid values
  const formattedDate = isStartDateValid
    ? format(startDate, "dd MMM yyyy")
    : "-";

  const formattedEndDate = isEndDateValid
    ? format(endDate, "dd MMM yyyy")
    : "-";

  return (
    <section className="">
      <div className="tripListMobileTableData">
        <div className="tripListMobileTableDataContent">
          {/* <div className="tripListMobileTableDataRoute">
            <h3>Route Code</h3>
            <p>{data?.route_code}</p>
          </div> */}

          <div className="tripListMobileTableDataRoute">
            <h3>Trip ID</h3>
            <p>{data?.trip_id}</p>
            {/* <p>#{data?.trip_id.substr(data?.trip_id.length - 4)}</p> */}
          </div>

          <StatusTag value={data.status} />
        </div>

        <div className="tripListMobileTableDistance">
          <img
            src={
              data?.status === "Scheduled"
                ? scheduledRoute
                : data?.status === "In-progress"
                  ? inProgressRoute
                  : completedRoute
            }
            alt="responsiveDot"
          />
          <span className="tripListMobileTableDistanceKilometer">
            {`${data?.distance} km`}
          </span>
        </div>

        <div className="tripListMobileTableCountry">
          <div className="tripListMobileTableCountryStartDate">
            <h5>
              {data?.origin
                ?.toLowerCase()
                .replace(/\b(\w)/g, (x) => x.toUpperCase())}
            </h5>
            <p>{formattedDate}</p>
          </div>
          <div className="tripListMobileTableCountryEndDate">
            <h5>
              {" "}
              {data?.destination
                ?.toLowerCase()
                .replace(/\b(\w)/g, (x) => x.toUpperCase())}
            </h5>
            <p>{formattedEndDate}</p>
          </div>
        </div>

        <button
          onClick={() => handleClick(data?.trip_id, "TRIP_MOBILE")}
          className="tripListMobileTableButton"
        >
          View Details
        </button>
      </div>
    </section>
  );
};

export default TripListTableMobile;
