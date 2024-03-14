import { useEffect, useState } from "react";

import CardLogo from "assets/images/statusCard/statusCardImg.svg";
// import TripRouteLine from "assets/images/TripSummary/tripRouteLineImage.svg";
// import TripRouteDottedLine from "assets/images/TripSummary/dottedLine.svg";
import Truck from "assets/images/TripSummary/truck.svg";
import Skeleton from "components/Skeleton";
import TripMapMobile from "components/TripMapMobile";
import { format, isValid } from "date-fns";

import { getWindowWidth } from "utils/window";

import "components/TripSummary/tripSummary.scss";

const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Scheduled":
      return "#FFFBE6";
    case "Completed":
      return "#DAF5DD";
    case "Running":
      return "#E2ECF9";
    case "In-progress":
      return "#E2ECF9";
    case "Cancelled":
      return "#f3d4d4";
    default:
      return "";
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case "Scheduled":
      return "#E0AF00";
    case "Completed":
      return "#31A93E";
    case "Running":
      return "#1D67CD";
    case "In-progress":
      return "#1D67CD";
    case "Cancelled":
      return "#ff0000";
    default:
      return "";
  }
};

const getStatusCircleColor = (status) => {
  switch (status) {
    case "Scheduled":
      return "#E0AF00";
    case "Completed":
      return "#31A93E";
    case "Running":
      return "#1D67CD";
    case "In-progress":
      return "#1D67CD";
    case "Cancelled":
      return "#ff0000";
    default:
      return "";
  }
};

const TripSummary = ({
  summaryData,
  getFormattedDistance,
  getFormattedCapacity,
  getFormattedFuelEfficiency,
  loading,
  recommendedPoints,
  getFormattedFuelLiter,
  route,
  waypoints
}) => {
  const backgroundColor = getStatusBackgroundColor(summaryData?.status);
  const textColor = getStatusTextColor(summaryData?.status);
  const circleColor = getStatusCircleColor(summaryData?.status);

  const [truckPosition, setTruckPosition] = useState(0);
  const [balanceDistance, setBalanceDistance] = useState(0);

  useEffect(() => {
    if (!loading) {
      const distanceCovered = summaryData?.distance_covered || 0;
      const totalDistance = summaryData?.total_distance || 1; // Avoid division by zero

      const newPosition = (distanceCovered / totalDistance) * 100;
      const balancedDistance = 100 - newPosition;
      setTruckPosition(newPosition);
      setBalanceDistance(balancedDistance);
    }
  }, [summaryData, loading]);

  // const leftPosition = (650 / 700) * 100;
  // summaryData?.distance_covered !== null &&
  // summaryData?.distance_covered !== undefined &&
  // summaryData?.distance_covered !== "" &&
  // summaryData?.total_distance !== ""
  //   ? `${
  //       (summaryData?.distance_covered / summaryData?.total_distance) * 100
  //     }%`
  //   : "0%";

  // const firstCapitalLetter = (loadType) => {
  //   if (!loadType) {
  //     return "-";
  //   }

  //   return loadType
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase())
  //     .join("");
  // };

  const isMobile = window.innerWidth <= 768;

  const loadDetails = [
    {
      label: !isMobile ? "Trip ID" : "",
      value: !isMobile ? summaryData?.trip_id : null
    },
    {
      label: !isMobile ? "Route ID" : "",
      value: !isMobile ? summaryData?.route_code : null
    },
    {
      label: "Vehicle No.",
      value: summaryData?.vehicle_no
    },
    {
      label: "No. of Drivers",
      value: summaryData?.no_of_driver
    },
    {
      label: "Reefer",
      value: summaryData?.reefer
    },
    {
      label: "Reefer Mileage",
      value: getFormattedFuelLiter(summaryData?.refeer_mileage)
    },
    {
      label: "Load type",
      // value: firstCapitalLetter(summaryData?.load_type) || "-"
      value: summaryData?.load_type
        ?.toLowerCase()
        .replace(/\b(\w)/g, (x) => x.toUpperCase())
    },
    {
      label: "Loaded Mileage",
      value: getFormattedFuelEfficiency(summaryData?.loaded_mileage)
    },
    {
      label: "Tank Capacity",
      value: getFormattedCapacity(summaryData?.tank_capacity)
    },
    {
      label: "Rec. Fuel Vol (Engine / Reefer)",
      value: `${getFormattedCapacity(
        summaryData?.rec_eng_fuel_volume
      )} / ${getFormattedCapacity(summaryData?.rec_ref_fuel_volume)}`
    }
  ];

  const loadDescription = [
    {
      title: "Start Location",
      description: summaryData?.start_location
    },
    {
      title: "End Location",
      description: summaryData?.end_location
    },
    {
      title: "Route Description",
      description: summaryData?.route_desc
        ?.toLowerCase()
        .replace(/\b(\w)/g, (x) => x.toUpperCase())
        .trim()
    }
  ];

  // Ensure valid date values or set to null
  const startDate = summaryData?.start_date
    ? new Date(summaryData.start_date)
    : null;
  const endDate = summaryData?.end_date ? new Date(summaryData.end_date) : null;

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
    <div className="tripSummary">
      <div className="tripSummaryTitle">
        <div className="tripSummaryTitleMain">
          <img src={CardLogo} alt="CardLogo" />
          <h2>Trip Summary</h2>
        </div>

        <div className="tripSummaryTitleDetails">
          {loading ? (
            <Skeleton width={"100px"} height={"20"} />
          ) : (
            <span
              className="tripSummaryTitleStatus"
              style={{ backgroundColor, color: textColor }}
            >
              {summaryData?.status}
              <span
                className="tripSummaryTitleStatusCircle"
                style={{ background: circleColor }}
              ></span>
            </span>
          )}
        </div>
      </div>
      <div className="tripSummaryTitleDetailsPhn">
        <div className="tripSummaryTitleDistancePhn">
          <p>Route ID</p>
          {loading ? (
            <Skeleton width={"100px"} height={"20"} />
          ) : (
            <span>{summaryData?.route_code}</span>
            //   <span>
            //   {summaryData?.distance_covered || "0"}
            //   <label>
            //     / {getFormattedDistance(summaryData?.total_distance)}
            //   </label>
            // </span>
          )}
        </div>
        <div className="tripSummaryTitleTripIdPhn">
          <p>Trip ID</p>
          {loading ? (
            <Skeleton width={"100px"} height={"20"} />
          ) : (
            <span>
              {summaryData?.trip_id}
              {/* {summaryData?.trip_id
                ? `#${summaryData?.trip_id.substr(
                    summaryData?.trip_id.length - 4
                  )}`
                : "-"} */}
            </span>
          )}
        </div>
      </div>
      <div className="tripSummaryDetails">
        <div className="tripSummaryTrip">
          <div className="tripSummaryTripLayer">
            {loading ? (
              <Skeleton width={"100px"} height={"20"} />
            ) : (
              <div className="routePhn">
                <div
                  className="tripSummaryTripRouteLine"
                  style={{ flexBasis: truckPosition + "%" }}
                ></div>

                <div
                  className="tripSummaryTripRouteDottedLine"
                  style={{ flexBasis: balanceDistance + "%" }}
                ></div>

                <img
                  className="truckIcon"
                  src={Truck}
                  alt="Truck"
                  style={{
                    left: `calc(${truckPosition}% - ${
                      truckPosition < 90 ? "4px" : "18px"
                    })`
                  }}
                />

                <div className="tripSummaryTitleDistance">
                  <span>
                    {summaryData?.distance_covered || "0"}
                    <label>
                      / {getFormattedDistance(summaryData?.total_distance)}
                    </label>
                  </span>
                </div>
              </div>
            )}

            <div className="tripSummaryTripStartEnd">
              {loading ? (
                <Skeleton width={"100px"} height={"20"} />
              ) : (
                <>
                  <div className="tripSummaryTripStart">
                    <span>
                      {summaryData?.origin
                        ?.toLowerCase()
                        .replace(/\b(\w)/g, (x) => x.toUpperCase())}
                    </span>
                    <p>{formattedDate}</p>
                  </div>

                  <div className="tripSummaryTripRoute">
                    <div
                      className="tripSummaryTripRouteLine"
                      style={{ flexBasis: truckPosition + "%" }}
                    ></div>

                    <div
                      className="tripSummaryTripRouteDottedLine"
                      style={{ flexBasis: balanceDistance + "%" }}
                    ></div>

                    <img
                      className="truckIcon"
                      src={Truck}
                      alt="Truck"
                      style={{
                        left: `calc(${truckPosition}% - ${
                          truckPosition < 90 ? "4px" : "18px"
                        })`
                      }}
                    />

                    <div className="tripSummaryTitleDistance">
                      <span>
                        {summaryData?.distance_covered || "0"}
                        <label>
                          / {getFormattedDistance(summaryData?.total_distance)}
                        </label>
                      </span>
                    </div>
                  </div>

                  <div className="tripSummaryTripEnd">
                    <span>
                      {summaryData?.destination
                        ?.toLowerCase()
                        .replace(/\b(\w)/g, (x) => x.toUpperCase())}
                    </span>
                    <p>{formattedEndDate}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="tripSummaryTripDescription">
            {loadDescription.map((item, index) => (
              <div key={index} className="tripSummaryTripDescriptionData">
                {!loading && <span>{item.title}</span>}
                {loading ? (
                  <Skeleton width={"100px"} height={"20"} />
                ) : (
                  <p>{item.description}</p>
                )}
              </div>
            ))}
            {loadDescription.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "30px"
                }}
              >
                No description found
              </p>
            )}
          </div>
        </div>

        <div className="tripSummaryVehicle">
          <div className="tripSummaryVehicleLoad">
            {loadDetails.map((item, i) => (
              <div
                key={i}
                style={{ display: item.value === null ? "none" : "block" }}
                className="tripSummaryVehicleLoadDetails"
              >
                {loading ? (
                  <Skeleton width={"100px"} height={"20"} />
                ) : (
                  <>
                    <p>{item.label}</p>

                    <span>{item?.value || "-"}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {getWindowWidth() <= 1150 && (
        <div className="tripSummaryMobileSection">
          <h3>Map View</h3>
          <div className="tripSummaryMobileMap">
            <TripMapMobile
              loading={loading}
              recommendedPoints={recommendedPoints}
              route={route}
              waypoints={waypoints}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSummary;
